import mongoose from 'mongoose';
import { BandSchema } from '../band/band.model';
import { BusinessSchema } from '../business/businessModel';

const EventSchema = new mongoose.Schema({
  business: BusinessSchema,
  description: String,
  genres: [String],
  max_bands_number: Number,
  min_bands_number: Number,
  name: String,
  open_mic: Boolean,
  payment: Number,
  startDate: Date,
  endDate: Date,
  requests: [
    {
      band: BandSchema,
      status: {
        type: String,
        enum: [
          'WAITING_FOR_BAND_APPROVAL',
          'WAITING_FOR_BUSINESS_APPROVAL',
          'DENIED',
          'APPROVED'
        ]
      }
    }
  ],
  photos: [String]
});

const EventModel = mongoose.model('Event', EventSchema);

export { EventModel, EventSchema };
