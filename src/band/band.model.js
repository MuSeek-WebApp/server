import mongoose from 'mongoose';
import { userOptions, UserModel } from '../user/user.model';

const BandSchema = new mongoose.Schema(
  {
    bandMembers: [{ name: String, roles: [String] }],
    genres: [String]
  },
  userOptions
);

const BandModel = UserModel.discriminator('band', BandSchema);
export { BandModel, BandSchema };
