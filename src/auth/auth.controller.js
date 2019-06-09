import * as createError from 'http-errors';
import AuthService from './auth.srv';
import { UserModel } from '../user/user.model';
import logger from '../utils/logger';

exports.auth = async (req, res, next) => {
  const { idToken } = req.cookies;
  const decodedToken = await AuthService.auth(idToken);
  if (decodedToken) {
    req.reqUser = await UserModel.findById(decodedToken.uid).exec();
    next();
  } else {
    next(createError(403, 'Forbidden'));
  }
};

exports.checkAuth = async (req, res) => {
  const { idToken } = req.cookies;
  try {
    await AuthService.auth(idToken);
    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    switch (error.code) {
      case 'auth/id-token-expired': {
        res.sendStatus(401);
        break;
      }
      default: {
        res.sendStatus(403);
      }
    }
  }
};

exports.login = async (req, res) => {
  const { idToken } = req.body;
  const auth = await AuthService.login(idToken);
  if (auth) {
    res.cookie('idToken', idToken);
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
};

exports.register = async (req, res) => {
  const { auth, userData, profile_photo } = req.body;
  const regData = await AuthService.register(auth, userData, profile_photo);
  if (regData) {
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
};

exports.getUserData = async (req, res) => {
  const { idToken } = req.cookies;
  res.json(await AuthService.getUserData(idToken));
};

exports.uploadProfilePic = async (req, res) => {
  try {
    logger.debug(`[auth.controller] [uploadProfilePic: ${req.files.length}]`);
    if (req.files[0]) {
      const resUrl = {
        profile_picture: await AuthService.uploadToCloudinary(req.files[0])
      };
      res.status(200).json(resUrl);
    }
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
};
