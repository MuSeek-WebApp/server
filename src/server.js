import morgan from 'morgan';
import admin from 'firebase-admin';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import path from 'path';
import express from 'express';

import routes from './server.route';
import apiRoutes from './server.api.route';
import { wsServer, wsRouter } from './server.ws.route';
import logger, { stream } from './utils/logger';
import serviceAccount from './config/serviceAccountKey.json';
import * as authCtrl from './auth/auth.controller';

const api = wsServer.app;
api.use(bodyParser.json());
api.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  api.use(morgan('dev', { stream }));
} else {
  api.use(morgan('combined', { stream }));
}

mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    logger.info('Mongo connection successful');
  })
  .catch(() => {
    logger.error('Mongo connection error');
  });

// mount all routes on /api path
api.use(express.static(path.join(__dirname, '../view')));
api.set('views', path.join(__dirname, '../view'));
api.use('/ws', wsRouter);
api.use('/api', authCtrl.auth);
api.use('/api', apiRoutes);
api.use('/', routes);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL
});

if (require.main === module) {
  api.listen(process.env.API_PORT, (err) => {
    if (err) {
      logger.error({ err });
      process.exit(1);
    }
    logger.info(
      `API is now running on port ${process.env.API_PORT} 
      in ${process.env.NODE_ENV} mode`
    );
  });
}

/**
 * @param err.status_code
 */
api.use((err, req, res, next) => {
  const status =
    err.status ||
    err.statusCode ||
    err.status_code ||
    (err.output && err.output.statusCode) ||
    500;
  // skip anything not marked as an internal server error
  if (status < 500) return next(err);
  logger.error({ err });
  return next(err);
});

module.exports = api;
