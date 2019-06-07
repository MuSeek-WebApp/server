import express from 'express';
import path from 'path';
import authRoutes from './auth/auth.route';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/health-check', (req, res) => res.send('OK'));
// mount auth routes at /auth
router.use('/auth', authRoutes);

router.get('/', (req, res) => {
  res.sendfile(path.join(__dirname, '../view/index.html'));
});

export default router;
