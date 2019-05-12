import express from 'express';
import multer from 'multer';

import * as profileCtrl from './profile.controller';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/uid', profileCtrl.getUid);
router.post('/get', profileCtrl.getProfile);
router.post('/upload', upload.any(), profileCtrl.uploadProfileImage);
router.post('/update', profileCtrl.updateProfile);

export default router;
