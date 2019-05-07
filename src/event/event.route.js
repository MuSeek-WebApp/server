import express from 'express';

import * as eventsCtrl from './event.controller';

const router = express.Router();

router.get('/', eventsCtrl.findAll);
router.get('/my-events', eventsCtrl.myEvents);
router.post('/', eventsCtrl.insertEvent);
router.put('/:id', eventsCtrl.updateEvent);
router.put('/status/:id', eventsCtrl.updateArtistStatus);
router.delete('/:id', eventsCtrl.removeEvent);
router.post('/my-feed', eventsCtrl.bandFeed);

export default router;
