import express from "express";
import * as authCtrl from "./auth.controller";

const router = express.Router();

/**
 * Middleware auth verify
 */
router.use(authCtrl.auth);

/**
 * POST /api/auth/login - Returns token if correct
 */
router.post("/login", authCtrl.login);

export default router;
