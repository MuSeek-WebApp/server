import express from 'express';
import authRoutes from './auth/auth.route';
import eventsRoutes from './events/events.route';

const router = express.Router(); // eslint-disable-line new-cap

router.use('/events', eventsRoutes);

export default router;
