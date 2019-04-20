import mongoose from 'mongoose';
import { userOptions, userModel } from '../auth/user.model';

var bandSchema = new mongoose.Schema(
  {
    bandMembers: [{ name: String, roles: [String] }],
    genres: [String]
  },
  userOptions
);

var bandModel = userModel.discriminator('band', bandSchema);
module.exports = {
  bandModel: bandModel,
  bandSchema: bandSchema
};
