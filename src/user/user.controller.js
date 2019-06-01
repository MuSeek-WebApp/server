import logger from '../utils/logger';
import UserService from './user.srv';

export async function filterReviews(req, res) {
  try {
    const { userId } = req.body;
    res.json(await UserService.filterReviews(userId));
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
}

export async function removeReview(req, res) {
  try {
    const { reqUser } = req;
    const reviewId = req.params.id;
    await UserService.removeReview(reqUser._id, reviewId);
    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
}

export async function updateReview(req, res) {
  try {
    const userId = req.params.id;
    await UserService.updateReview(userId, req.body);
    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
}

export async function postReview(req, res) {
  try {
    const { userId, review } = req.body;
    const result = await UserService.addReview(userId, review);
    res.json(result.reviews.filter((rev) => rev.eventId === review.eventId));
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
}

export async function getLikesAndDislikes(req, res) {
  try {
    const userId = req.params.id;
    res.json(await UserService.getLikesAndDislikes(userId));
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
}
