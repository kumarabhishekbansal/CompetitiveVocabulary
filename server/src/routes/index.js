import express from 'express';
import healthRoutes from './health.routes.js';
import vocabularyRoutes from './vocabulary.routes.js';
import authRoutes from './auth.routes.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/vocabulary', vocabularyRoutes);

export default router;
