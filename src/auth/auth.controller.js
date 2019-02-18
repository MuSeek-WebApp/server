import admin from "firebase-admin";
import createError from "http-errors";

import logger from "../scripts/logger";

export function auth(req, res, next) {
  const { idToken } = req.cookies;
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(() => {
      logger.info("idToken:" + idToken + " idToken");
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
    .verifyIdToken(req.body.idToken)
    .then(decodedToken => {
      const uid = decodedToken.uid;
      logger.info("user logged in (" + uid + ")");
      res.cookie("idToken", req.body.idToken);
      res.sendStatus(200);
    })
    .catch(error => {
      logger.error(error);
      res.sendStatus(403);
    });
}
