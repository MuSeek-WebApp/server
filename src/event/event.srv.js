/* eslint-disable no-return-await */
/* eslint-disable func-names */
import { EventModel } from './event.model';
import logger from '../utils/logger';

class EventService {
  constructor() {
    logger.info('EventService initiated.');
  }

  async all() {
    return await EventModel.find({}).exec();
  }

  async findById(id) {
    return await EventModel.findById(id).exec();
  }

  async getFilteredEvents(filter, userId) {
    const sortingFields = { startDate: 1 };

    if (!filter) {
      return await EventModel.find()
        .sort(sortingFields)
        .exec();
    }

    const aggregateQuery = [];
    const matchQuery = {};

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
      // creates and average of buisness stars
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

    return await EventModel.aggregate(aggregateQuery)
      .sort(sortingFields)
      .exec();
  }

  async getArtistEvents(userId) {
    return await EventModel.aggregate([
      { $unwind: '$requests' },
      { $match: { 'requests.band._id': userId } }
    ]).exec();
  }

  async getBusinessEvents(userId) {
    return await EventModel.find({ 'business._id': userId }).exec();
  }

  async insert(event, user) {
    const newEvent = new EventModel(event);
    newEvent.business = user;
    return await newEvent.save();
  }

  async addRequest(eventId, band, status) {
    return await EventModel.findOneAndUpdate(
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
    return await EventModel.findOneAndUpdate(
      {
        _id: eventId,
        requests: requestsFilter
      },
      { $set: { 'requests.$.status': status } }
    ).exec();
  }

  async update(event) {
    return await EventModel.findByIdAndUpdate(event._id, event, { new: true });
  }

  async remove(id) {
    return await EventModel.findByIdAndRemove(id);
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
    EventModel.aggregate(aggregateQuery).then(function(res) {
      return !!res.length;
    });
  }
}

export default new EventService();
