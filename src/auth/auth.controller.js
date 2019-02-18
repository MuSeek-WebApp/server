import admin from "firebase-admin";
import createError from "http-errors";

import logger from "../scripts/logger";

export function auth(req, res, next) {
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
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
export function login(req, res, next) {
  admin
    .auth()
    .verifyIdToken(req.body.tokenId)
    .then(decodedToken => {
      const uid = decodedToken.uid;
      logger.info("user logged in (" + uid + ")");
      res.cookie("tokenId", req.body.tokenId);
      res.sendStatus(200);
    })
    .catch(error => {
      logger.error(error);
      res.sendStatus(403);
    });
}
