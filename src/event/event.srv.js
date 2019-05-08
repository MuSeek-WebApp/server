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

  async getFilteredEvents(filter) {
    const sortingFields = { startDate: 1 };

    if (!filter) {
      return await EventModel.find()
        .sort(sortingFields)
        .exec();
    } else {
      let aggregateQuery = [];
      let matchQuery = {};

      if (filter.genres && filter.genres.length != 0) {
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
        aggregateQuery.push({ $match: matchQuery });
        return await EventModel.aggregate(aggregateQuery)
          .sort(sortingFields)
          .exec();
      } else {
        return await EventModel.find(matchQuery)
          .sort(sortingFields)
          .exec();
      }
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

  async update(event) {
    return await EventModel.findByIdAndUpdate(event._id, event, { new: true });
  }

  async remove(id) {
    await EventModel.findByIdAndRemove(id);
  }

  async updateStatus(eventId, userId, oldStatus, action) {
    let newStatus = action;

    if (action === 'APPROVED' && oldStatus === 'WAITING_FOR_BAND_APPROVAL') {
      newStatus = 'WAITING_FOR_BUSINESS_APPROVAL';
    }

    await EventModel.updateOne(
      { _id: mongoose.Types.ObjectId(eventId), 'requests.band._id': userId },
      { $set: { 'requests.$.status': newStatus } }
    );

    return newStatus;
  }
}

export default new EventService();
