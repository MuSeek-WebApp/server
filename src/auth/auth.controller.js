import * as createError from 'http-errors';
import AuthService from './auth.srv';
import { UserModel } from '../user/user.model';

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
    const decodedToken = await AuthService.auth(idToken);
    if (decodedToken) {
      res.sendStatus(200);
    }
  } catch (error) {
    res.sendStatus(403);
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
  const { auth, userData } = req.body;
  const regData = await AuthService.register(auth, userData);
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
