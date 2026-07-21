import { Router } from 'express';
import { getTrendlineFilters, getTrendlineData, getBarGraphFilters, getBarGraphData, getMapData, getBarangayInsights } from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/trendline/filters', authenticate, getTrendlineFilters);
router.get('/trendline', authenticate, getTrendlineData);
router.get('/bar-graph/filters', authenticate, getBarGraphFilters);
router.get('/bar-graph', authenticate, getBarGraphData);
router.get('/map', authenticate, getMapData);
router.get('/barangay/:name', authenticate, getBarangayInsights);

export default router;
