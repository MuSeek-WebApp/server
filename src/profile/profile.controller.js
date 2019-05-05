import ProfileService from './profile.srv';

import logger from '../utils/logger';

export async function getUid(req, res) {
  try {
    logger.debug('[profile.controller] [getUid]');
    const { idToken } = req.cookies;
    const userUid = await ProfileService.getUid(idToken);
    res.json(userUid);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
}

export async function getProfile(req, res) {
  try {
    logger.debug(`[profile.controller] [getProfile: ${req.body.userId}]`);
    const userData = await ProfileService.getProfile(req.body.userId);
    res.json(userData);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
}

export async function uploadProfileImage(req, res) {
  try {
    logger.debug(
      `[profile.controller] [uploadProfileImage: ${req.files.length}]`
    );
    if (req.files[0]) {
      const resUrl = {
        profile_photo: await ProfileService.saveProfileImage(
          req.files[0],
          req.reqUser._id
        )
      };
      res.status(200).json(resUrl);
    }
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
}

export async function updateProfile(req, res) {
  try {
    logger.debug(
      `[profile.controller] [updateProfile data: ${JSON.stringify(
        req.body.profile
      )}]`
    );
    await ProfileService.updateProfileData(req.body.profile);
    res.status(200).send();
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
}
