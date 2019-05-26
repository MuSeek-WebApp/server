import logger from '../utils/logger';
import { UserModel } from './user.model';

class UserService {
  constructor() {
    logger.info('UserService initialized');
  }

  async addReview(userId, review) {
    return UserModel.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { reviews: review } },
      { new: true }
    ).exec();
  }

  async removeReview(userId, reviewId) {
    return UserModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { reviews: { _id: reviewId } } }
    ).exec();
  }

  async updateReview(userId, review) {
    return UserModel.findOneAndUpdate(
      { _id: userId, reviews: { $elemMatch: { _id: review._id } } },
      { $set: { 'reviews.$': review } }
    ).exec();
  }

  async getLikesAndDislikes(userId) {
    return UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$reviews' },
      {
        $group: {
          _id: '$_id',
          likes: { $sum: '$reviews.like' },
          dislikes: { $sum: '$reviews.dislike' }
        }
      }
    ]).exec();
  }

  async filterReviews(userId) {
    const sortingFields = {
      'reviews.timestamp': -1
    };

    return UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$reviews' },
      { $sort: sortingFields },
      {
        $group: {
          _id: '$_id',
          reviews: { $push: '$reviews' }
        }
      }
    ]).exec();
  }
}

export default new UserService();
