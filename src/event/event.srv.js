import cloudinary from 'cloudinary';
import { promisify } from 'util';
import { EventModel } from './event.model';
import { UserModel } from '../user/user.model';

import logger from '../utils/logger';

class EventService {
  constructor() {
    logger.info('EventService initiated.');
    this.cloudinary = cloudinary.v2;
  }

  async all() {
    return EventModel.find({}).exec();
  }

  async getReviews(id) {
    return UserModel.aggregate([
      { $match: { 'reviews.eventId': id } },
      {
        $project: {
          _id: '$_id',
          reviews: {
            $filter: {
              input: '$reviews',
              as: 'review',
              cond: { $eq: ['$$review.eventId', id] }
            }
          }
        }
      }
    ]).exec();
  }

  async findById(id) {
    return EventModel.findById(id).exec();
  }

  async getFilteredEvents(filter, userId) {
    const sortingFields = { startDate: 1 };

    // this if statement always false, beacuse you sent {} from the controller to the filter parameter
    if (!filter) {
      return EventModel.find({ startDate: { $gte: new Date() } })
        .sort(sortingFields)
        .exec();
    }

    const aggregateQuery = [];
    const matchQuery = {};
    matchQuery.startDate = { $gte: new Date() };

    if (filter.genres && filter.genres.length > 0) {
      // checks if there is an intersection of one of the genres
      matchQuery.genres = { $in: filter.genres };
    }
    if (filter.name) {
      matchQuery.name = { $regex: `.*${filter.name}.*`, $options: 'i' };
    }
    if (filter.lowerDateLimit && filter.higherDateLimit) {
      matchQuery.startDate = {
        $gte: new Date(filter.lowerDateLimit),
        $lte: new Date(filter.higherDateLimit)
      };
    }
    if (filter.stars) {
      // creates and average of business stars
      aggregateQuery.push({
        $addFields: { buisnessStarsAvg: { $avg: '$business.reviews.stars' } }
      });
      matchQuery.buisnessStarsAvg = { $gte: filter.stars };
    }

    // filter events who achieved max bands
    aggregateQuery.push({
      $addFields: {
        approvedReq: {
          $size: {
            $filter: {
              input: '$requests',
              as: 'req',
              cond: { $eq: ['$$req.status', 'APPROVED'] }
            }
          }
        }
      }
    });
    matchQuery.$expr = { $lt: ['$approvedReq', '$max_bands_number'] };
    aggregateQuery.push({ $match: matchQuery });

    // filter requests of other bands
    aggregateQuery.push({
      $addFields: {
        requests: {
          $filter: {
            input: '$requests',
            as: 'req',
            cond: { $eq: ['$$req.band._id', userId] }
          }
        }
      }
    });

    return EventModel.aggregate(aggregateQuery)
      .sort(sortingFields)
      .exec();
  }

  async getArtistEvents(userId) {
    return EventModel.aggregate([
      { $unwind: '$requests' },
      {
        $match: { 'requests.band._id': userId, startDate: { $gte: new Date() } }
      }
    ]).exec();
  }

  async getBusinessEvents(userId) {
    return EventModel.find({ 'business._id': userId }).exec();
  }

  async insert(event, user) {
    const newEvent = new EventModel(event);
    newEvent.business = user;
    return newEvent.save();
  }

  async addRequest(eventId, band, status) {
    return EventModel.findOneAndUpdate(
      { _id: eventId, 'requests.band._id': { $ne: band._id } },
      { $addToSet: { requests: { band, status } } }
    ).exec();
  }

  async updateRequest(eventId, bandId, status, oldStatus) {
    let requestsFilter;
    if (oldStatus) {
      requestsFilter = {
        $elemMatch: { 'band._id': bandId, status: oldStatus }
      };
    } else {
      requestsFilter = { $elemMatch: { 'band._id': bandId } };
    }
    return EventModel.findOneAndUpdate(
      {
        _id: eventId,
        requests: requestsFilter
      },
      { $set: { 'requests.$.status': status } }
    ).exec();
  }

  async uploadImage(file) {
    const uploadAsync = promisify(this.cloudinary.uploader.upload);
    return uploadAsync(file.path);
  }

  async update(event) {
    return EventModel.findByIdAndUpdate(event._id, event, { new: true });
  }

  async remove(id) {
    await EventModel.findByIdAndRemove(id);
  }

  async getEventsByName(nameText) {
    return EventModel.find(
      {
        name: { $regex: `.*${nameText}.*`, $options: 'i' }
      },
      { _id: 1, name: 1 }
    ).exec();
  }

  isEventfull(eventId) {
    const aggregateQuery = [];
    const matchQuery = {};

    aggregateQuery.push({
      $addFields: {
        approvedReq: {
          $size: {
            $filter: {
              input: '$requests',
              as: 'req',
              cond: { $eq: ['$$req.status', 'APPROVED'] }
            }
          }
        }
      }
    });
    matchQuery.$expr = { $gte: ['$approvedReq', '$max_bands_number'] };
    matchQuery._id = eventId;
    aggregateQuery.push(matchQuery);
    EventModel.aggregate(aggregateQuery).then((res) => {
      return !!res.length;
    });
  }
}

export default new EventService();
