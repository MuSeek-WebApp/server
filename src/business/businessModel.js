import mongoose from 'mongoose';
import { userOptions, UserModel } from '../auth/user.model';

const BusinessSchema = new mongoose.Schema(
  {
    photos: [String]
  },
  userOptions
);

const BusinessModel = UserModel.discriminator('business', BusinessSchema);
export { BusinessModel, BusinessSchema };
