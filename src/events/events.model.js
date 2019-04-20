import mongoose from 'mongoose';
import { bandSchema } from '../band/band.model';

var eventSchema = new mongoose.Schema({
  business: String,
  description: String,
  genres: [String],
  max_bands_number: Number,
  min_bands_number: Number,
  name: String,
  open_mic: Boolean,
  payment: Number,
  timestamp: { end: Number, start: Number },
  bands: [bandSchema]
});

var eventModel = mongoose.model('Event', eventSchema);

module.exports = {
  eventModel: eventModel,
  eventSchema: eventSchema
};
