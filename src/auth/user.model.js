import mongoose from 'mongoose';

var options = { discriminatorKey: 'type' };

var userSchema = new mongoose.Schema(
  {
    //uuid
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
    }
  },
  options
);

var userModel = mongoose.model('User', userSchema, 'users');
module.exports = {
  userModel: userModel,
  userSchema: userSchema,
  userOptions: options
};
