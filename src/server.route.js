import express from 'express';
import authRoutes from './auth/auth.route';
import bandRoutes from './band/band.route';

const router = express.Router(); // eslint-disable-line new-cap

/**
 * GET /health-check - Check service health
 */
router.get('/health-check', (req, res) => res.send('OK'));

// mount auth routes at /auth
router.use('/auth', authRoutes);
router.use('/band', bandRoutes);

export default router;
