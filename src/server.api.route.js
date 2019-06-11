import express from 'express';
import eventRoutes from './event/event.route';
import bandRoutes from './band/band.route';
import profileRoutes from './profile/profile.route';
import userRoutes from './user/user.route';
import generalRoutes from './general/general.route';

const router = express.Router(); // eslint-disable-line new-cap

router.use('/event', eventRoutes);
router.use('/band', bandRoutes);
router.use('/profile', profileRoutes);
router.use('/user', userRoutes);
router.use('/general', generalRoutes);

export default router;
