import { EventModel } from './event.model';
import logger from '../utils/logger';

class EventService {
  constructor() {
    logger.info('EventService initiated.');
  }

  async all() {
    return await EventModel.find({}).exec();
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
    return await EventModel.findByIdAndUpdate(
      event._id,
      event,
      { new: true },
      (err, updatedEvent) => {
        if (err) throw err;
        return updatedEvent;
      }
    );
  }

  async remove(id) {
    await EventModel.findByIdAndRemove(id, (err) => {
      if (err) throw err;
    });
  }
}

export default new EventService();
