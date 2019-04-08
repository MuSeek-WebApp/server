import express from 'express';
import eventsRoutes from './events/events.route';
import eventsRoutes from './band/band.route';

const router = express.Router(); // eslint-disable-line new-cap

router.use('/events', eventsRoutes);
router.use('/band', bandRoutes);

export default router;
