import express from 'express';

import * as eventsCtrl from './event.controller';
import * as wsService from '../ws/ws.srv';

const router = express.Router();

router.get('/', eventsCtrl.findAll);
router.get('/id/:id', eventsCtrl.findById);
router.get('/my-events', eventsCtrl.myEvents);
router.post('/', eventsCtrl.insertEvent);
router.put('/:id', eventsCtrl.updateEvent);
router.delete('/:id', eventsCtrl.removeEvent);
router.post('/my-feed', eventsCtrl.bandFeed);
router.post('/register-band', eventsCtrl.registerBand);
router.post('/approve-band', eventsCtrl.approveBand);
router.post('/deny-band', eventsCtrl.denyBand);

// update webSocket clients
router.use(
  ['/register-band', '/approve-band', '/deny-band', '/', '/:id'],
  (req) => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
      wsService.broadcastRefreshEvents();
    }
  }
);

export default router;
