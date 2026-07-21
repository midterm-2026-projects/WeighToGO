import { Router } from 'express';
import { getMonthlyReport, getHealthReport, getMasterlistReport } from '../controllers/report.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/monthly', authenticate, getMonthlyReport);
router.get('/health', authenticate, getHealthReport);
router.get('/masterlist', authenticate, getMasterlistReport);

export default router;
