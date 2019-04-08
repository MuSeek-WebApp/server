import admin from 'firebase-admin';
import * as createError from 'http-errors';

import logger from '../utils/logger';

exports.getCurrentMonth = (req, res) => {
  const db = admin.database();
  const ref = db.ref(`events/${times.uid}`);
  res.sendStatus(200);
};
