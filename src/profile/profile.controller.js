import ProfileService from './profile.srv';

import logger from '../utils/logger';

exports.getUid = async (req, res) => {
  try {
    logger.debug('[profile.controller] [getUid]');
    const { idToken } = req.cookies;
    const userUid = await ProfileService.getUid(idToken);
    res.json(userUid);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};

exports.getProfile = async (req, res) => {
  try {
    logger.debug(`[profile.controller] [getProfile: ${req.body.userId}]`);
    const userData = await ProfileService.getProfile(req.body.userId);
    res.json(userData);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    logger.debug(
      `[profile.controller] [uploadProfileImage: ${req.files.length}]`
    );
    if (req.files[0]) {
      const { idToken } = req.cookies;
      const resUrl = {
        profile_photo: await ProfileService.saveProfileImage(
          req.files[0],
          idToken
        )
      };
      res.status(200).json(resUrl);
    }
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};
