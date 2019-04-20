import express from 'express';

import * as eventsCtrl from './events.controller';

const router = express.Router();

router.get('/', eventsCtrl.findAll);
router.get('/:id', eventsCtrl.findById);
router.post('/', eventsCtrl.insertEvent);
router.put('/:id', eventsCtrl.updateEvent);
router.delete('/:id', eventsCtrl.removeEvent);

export default router;
