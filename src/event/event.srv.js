import { EventModel } from './event.model';
import logger from '../utils/logger';

class EventService {
  constructor() {
    logger.info('EventService initiated.');
  }

  async all() {
    return EventModel.find({}).exec();
  }

  async getArtistEvents(userId) {
    return EventModel.aggregate([
      { $unwind: '$requests' },
      { $match: { 'requests.band._id': userId } }
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

  async update(event) {
    return EventModel.findByIdAndUpdate(event._id, event, { new: true });
  }

  async remove(id) {
    await EventModel.findByIdAndRemove(id);
  }
}

export default new EventService();
