import express from 'express';
import eventRoutes from './event/event.route';
import bandRoutes from './band/band.route';

const router = express.Router(); // eslint-disable-line new-cap

router.use('/event', eventRoutes);
router.use('/band', bandRoutes);

export default router;
