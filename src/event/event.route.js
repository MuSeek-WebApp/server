import express from 'express';
import multer from 'multer';

import * as eventsCtrl from './event.controller';
import * as wsService from '../ws/ws.srv';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', eventsCtrl.findAll);
router.get('/id/:id', eventsCtrl.findById);
router.get('/reviews/:id', eventsCtrl.getReviews);
router.get('/my-events', eventsCtrl.myEvents);
router.post('/', eventsCtrl.insertEvent);
router.post('/recommend', eventsCtrl.recommendBands);
router.put('/:id', eventsCtrl.updateEvent);
router.delete('/:id', eventsCtrl.removeEvent);
router.post('/my-feed', eventsCtrl.bandFeed);
router.post('/register-band', eventsCtrl.registerBand);
router.post('/approve-band', eventsCtrl.approveBand);
router.post('/deny-band', eventsCtrl.denyBand);
router.post('/uploadImage', upload.any(), eventsCtrl.uploadImage);

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
