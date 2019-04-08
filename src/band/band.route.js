import express from 'express';

import * as bandCtrl from './band.controller';

const router = express.Router();

router.get('/all', bandCtrl.all);

export default router;
