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
