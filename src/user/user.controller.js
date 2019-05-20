import logger from '../utils/logger';
import UserService from './user.srv';

export async function filterReviews(req, res) {
  try {
    const { sortType, userId } = req.body;
    res.json(await UserService.filterReviews(sortType, userId));
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
    const { review } = req.body;
    const userId = req.params.id;
    await UserService.updateReview(userId, review);
    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
}

export async function postReview(req, res) {
  try {
    const { userId, review } = req.body;
    await UserService.addReview(userId, review);
    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
}

export async function getRating(req, res) {
  try {
    const userId = req.params.id;
    res.json(await UserService.getRating(userId));
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
}
