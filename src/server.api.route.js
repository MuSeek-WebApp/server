import express from 'express';
import eventsRoutes from './events/events.route';
import bandRoutes from './band/band.route';
import profileRoutes from './profile/profile.route';

const router = express.Router(); // eslint-disable-line new-cap

router.use('/events', eventsRoutes);
router.use('/band', bandRoutes);
router.use('/profile', profileRoutes);

export default router;
