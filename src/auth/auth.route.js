import express from 'express';

import * as authCtrl from './auth.controller';

const router = express.Router();

/**
 * POST /api/auth/login - Returns token if correct
 */
router.post('/login', authCtrl.login);
router.post('/register', authCtrl.register);
router.get('/getUserData', authCtrl.getUserData);
router.get('/checkAuth', authCtrl.checkAuth);

export default router;
