import express from 'express';

import * as bandCtrl from './band.controller';

const router = express.Router();

router.get('/all', bandCtrl.all);
router.get('/filter', bandCtrl.filter);

export default router;
