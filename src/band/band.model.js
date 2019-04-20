import mongoose from 'mongoose';

var bandSchema = new mongoose.Schema({
  //uuid
  _id: String,
  address: { ciry: String, country: String, streetAddress: String },
  bandMembers: [{ name: String, roles: [String] }],
  contactDetails: {
    email: String,
    firstName: String,
    lastName: String,
    phoneNumber: String
  },
  description: String,
  name: String,
  genres: [String],
  type: String,
  reviews: [
    { description: String, stars: Number, timestamp: Number, user: String }
  ]
});

var bandModel = mongoose.model('Band', bandSchema);
module.exports = {
  bandModel: bandModel,
  bandSchema: bandSchema
};
