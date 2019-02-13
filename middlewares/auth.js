var express = require('express')
var router = express.Router()
var admin = require('firebase-admin');
var createError = require('http-errors');
var logger = require('../logger');

router.use((req, res, next) => {
    admin.auth().verifyIdToken(req.cookies.tokenId)
        .then(() => {
            logger.info("tokenId:" + tokenId + " verified")
            next()
        })
        .catch((error) => {
            logger.error(error)
            next(createError(403, 'Forbidden'))
        })
})

module.exports = router;