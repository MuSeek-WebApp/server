import mongoose from 'mongoose';

const userOptions = { discriminatorKey: 'type' };

const UserSchema = new mongoose.Schema(
  {
    // uuid
    _id: String,
    address: { city: String, country: String, streetAddress: String },
    contactDetails: {
      email: String,
      firstName: String,
      lastName: String,
      phoneNumber: String
    },
    description: String,
    name: String,
    reviews: [
      { description: String, stars: Number, timestamp: Number, user: String }
    ],
    profiles: {
      facebook: String,
      instegram: String,
      spotify: String,
      soundCloud: String,
      youtube: String
    },
    photos: [String]
  },
  userOptions
);

const UserModel = mongoose.model('User', UserSchema, 'users');
export { UserModel, UserSchema, userOptions };
