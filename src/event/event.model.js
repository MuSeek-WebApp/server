import mongoose from 'mongoose';
import { BandSchema } from '../band/band.model';

const EventSchema = new mongoose.Schema({
  business: String,
  description: String,
  genres: [String],
  max_bands_number: Number,
  min_bands_number: Number,
  name: String,
  open_mic: Boolean,
  payment: Number,
  startDate: String,
  endDate: String,
  startTime: String,
  endTime: String,
  bands: [BandSchema]
});

const EventModel = mongoose.model('Event', EventSchema);

export { EventModel, EventSchema };
