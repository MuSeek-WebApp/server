import { EventModel } from './event.model';
import logger from '../utils/logger';
import mongoose from 'mongoose';
class EventService {
  constructor() {
    logger.info('EventService initiated.');
  }

  async all() {
    return await EventModel.find({}).exec();
  }

  async getFilteredEvents(filter, userId) {
    const sortingFields = { startDate: 1 };

    if (!filter) {
      return await EventModel.find()
        .sort(sortingFields)
        .exec();
    } else {
      let aggregateQuery = [];
      let matchQuery = {};

      if (filter.genres && filter.genres.length > 0) {
        // checks if there is an intersection of one of the genres
        matchQuery.genres = { $in: filter.genres };
      }
      if (filter.name) {
        matchQuery.name = { $regex: '.*' + filter.name + '.*', $options: 'i' };
      }
      if (filter.lowerDateLimit && filter.higherDateLimit) {
        matchQuery.startDate = {
          $gte: filter.lowerDateLimit,
          $lte: filter.higherDateLimit
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
      { $addToSet: { requests: { band: band, status: status } } }
    ).exec();
  }

  async updateRequeset(eventId, bandId, oldStatus, status) {
    return await EventModel.findOneAndUpdate(
      {
        _id: eventId,
        requests: { $elemMatch: { 'band._id': bandId, status: oldStatus } }
      },
      { $set: { 'requests.$.status': status } }
    ).exec();
  }

  async update(event) {
    return await EventModel.findByIdAndUpdate(event._id, event, { new: true });
  }

  async remove(id) {
    await EventModel.findByIdAndRemove(id);
  }

  isEventfull(eventId) {
    let aggregateQuery = [];
    let matchQuery = {};

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
    matchQuery.$expr = { $eq: ['$approvedReq', '$max_bands_number'] };
    matchQuery._id = eventId;
    aggregateQuery.push(matchQuery);
    EventModel.aggregate(aggregateQuery).then(function(res) {
      return !!res.length;
    });
  }
}

export default new EventService();
