import express from 'express';

import * as eventsCtrl from './events.controller';

const router = express.Router();

router.get('/getCurrentMonth', eventsCtrl.getCurrentMonth);

export default router;
