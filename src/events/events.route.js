import express from 'express';

import * as eventsCtrl from './events.controller';

const router = express.Router();

router.get('/currentMonth', eventsCtrl.currentMonth);

export default router;
