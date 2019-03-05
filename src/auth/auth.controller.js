import admin from 'firebase-admin';
import * as createError from 'http-errors';

import logger from '../utils/logger';

exports.auth = (req, res, next) => {
  const { idToken } = req.cookies;
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(() => {
      logger.info(`idToken:${idToken} idToken`);
      next();
    })
    .catch((error) => {
      logger.error(error);
      next(createError(403, 'Forbidden'));
    });
};

exports.login = (req, res) => {
  const { idToken } = req.body;
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      const { uid } = decodedToken;
      logger.info(`user logged in (${uid})`);
      res.cookie('idToken', idToken);
      res.sendStatus(200);
    })
    .catch((error) => {
      logger.error(error);
      res.sendStatus(403);
    });
};

exports.register = (req, res) => {
  const { auth } = req.body;
  admin
    .auth()
    .createUser({
      email: auth.email,
      phoneNumber: auth.phoneNumber,
      password: auth.password
    })
    .then((userRecord) => {
      logger.info(`new user created (${userRecord.uid})`);
      const db = admin.database();
      const ref = db.ref(`users/${userRecord.uid}`);
      const { userData } = req.body;
      ref
        .set(userData)
        .then(() => {
          logger.info(
            'data for new user successfuly written to firebase database'
          );
          res.sendStatus(200);
        })
        .catch((error) => {
          logger.error(error);
          res.sendStatus(500);
        });
    })
    .catch((error) => {
      logger.error(error);
      res.sendStatus(500);
    });
};
