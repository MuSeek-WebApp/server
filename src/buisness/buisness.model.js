import mongoose from 'mongoose';
import { userOptions, userModel } from '../auth/user.model';

var buisnessSchema = new mongoose.Schema(
  {
    photos: [String]
  },
  userOptions
);

var buisnessModel = userModel.discriminator('buisness', buisnessSchema);
module.exports = {
  buisnessModel: buisnessModel,
  buisnessSchema: buisnessSchema
};
