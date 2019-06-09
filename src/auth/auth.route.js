import express from 'express';
import multer from 'multer';

import * as authCtrl from './auth.controller';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

/**
 * POST /api/auth/login - Returns token if correct
 */
router.post('/login', authCtrl.login);
router.post('/register', authCtrl.register);
router.get('/getUserData', authCtrl.getUserData);
router.get('/checkAuth', authCtrl.checkAuth);
router.post('/uploadProfilePic', upload.any(), authCtrl.uploadProfilePic);

export default router;
