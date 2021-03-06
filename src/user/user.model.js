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
      {
        description: String,
        like: Number,
        dislike: Number,
        timestamp: Date,
        userId: String,
        userName: String,
        eventId: String,
        eventName: String
      }
    ],
    profiles: {
      facebook: String,
      instagram: String,
      spotify: String,
      soundCloud: String,
      youtube: String
    },
    photos: [String],
    profile_photo: String
  },
  userOptions
);

const UserModel = mongoose.model('User', UserSchema, 'users');
export { UserModel, UserSchema, userOptions };
