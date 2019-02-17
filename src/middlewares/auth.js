import express from "express";
import admin from "firebase-admin";
import createError from "http-errors";
import logger from "../scripts/logger";

const router = express.Router();

router.use((req, res, next) => {
  const { tokenId } = req.cookies;
  admin
    .auth()
    .verifyIdToken(tokenId)
    .then(() => {
      logger.info("tokenId:" + tokenId + " verified");
      next();
    })
    .catch(error => {
      logger.error(error);
      next(createError(403, "Forbidden"));
    });
});

module.exports = router;
