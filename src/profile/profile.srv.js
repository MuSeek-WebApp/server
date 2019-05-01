import cloudinary from 'cloudinary';
import { promisify } from 'util';
import logger from '../utils/logger';
import AuthService from '../auth/auth.srv';
import { UserModel } from '../auth/user.model';

class ProfileService {
  constructor() {
    logger.info('ProfileService initialized');
    this.cloudinary = cloudinary.v2;
  }

  async getUid(userToken) {
    const { uid } = await AuthService.auth(userToken);
    return uid;
  }

  async getProfile(userId) {
    return UserModel.findOne({ _id: userId }).exec();
  }

  async saveProfileImage(file, userToken) {
    const userId = await this.getUid(userToken);
    try {
      const uploadAsync = promisify(this.cloudinary.uploader.upload);
      const result = await uploadAsync(file.path);
      await UserModel.findOneAndUpdate(
        { _id: userId },
        { profile_photo: result.url }
      ).exec();
    } catch (error) {
      logger.error(error);
    }
  }
}

export default new ProfileService();
