var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');
var logger = require('../logger');

router.post('/login', function (req, res, next) {
  admin.auth().verifyIdToken(req.body.tokenId)
    .then(decodedToken => {
      var uid = decodedToken.uid
      logger.info("user logged in (" + uid + ")")
      res.cookie('tokenId', req.body.tokenId)
      res.sendStatus(200)
    })
    .catch(error => {
      logger.error(error)
      res.sendStatus(403)
    })
})

module.exports = router;