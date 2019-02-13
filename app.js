var express = require('express');
var usersRouter = require('./routes/users');
var app = express();
var admin = require('firebase-admin');
var serviceAccount = require('./config/serviceAccountKey.json');

app.use(express.json());
app.use('/users', usersRouter);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://museek-ebe73.firebaseio.com'
  });

module.exports = app;