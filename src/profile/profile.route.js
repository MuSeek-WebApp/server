import express from 'express';

import * as profileCtrl from './profile.controller';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/uid', profileCtrl.getUid);
router.post('/get', profileCtrl.getProfile);
router.post('/upload', upload.any(), profileCtrl.uploadProfileImage);

export default router;
