import morgan from 'morgan';
import express from 'express';
import admin from 'firebase-admin';
import bodyParser from 'body-parser';

import routes from './app.route';
import { stream } from './scripts/logger';
import serviceAccount from './config/serviceAccountKey.json';

const app = express();
app.use(bodyParser.json());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev', { stream }));
} else {
  app.use(morgan('combined', { stream }));
}

// mount all routes on /api path
app.use('/api', routes);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://museek-ebe73.firebaseio.com'
});

module.exports = app;
