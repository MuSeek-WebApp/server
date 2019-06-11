import express from 'express';

import * as generalCtrl from './general.controller';

const router = express.Router();

router.get('/search/:text', generalCtrl.searchItem);

export default router;
