import express from 'express'
import admin from 'firebase-admin'
import logger from '../scripts/logger'

const router = express.Router();

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