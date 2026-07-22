import { Router } from 'express';
import { getAllChildren, getChildById, registerChild, submitAssessment, getChildHistory, getFilterOptions, getNutritionalTotals, toggleCheckupStatus } from '../controllers/child.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getAllChildren);
router.get('/filters', authenticate, getFilterOptions);
router.get('/totals', authenticate, getNutritionalTotals);
router.get('/:id', authenticate, getChildById);
router.get('/:id/history', authenticate, getChildHistory);
router.post('/', authenticate, registerChild);
router.put('/:id/assessment', authenticate, submitAssessment);
router.put('/:id/checkup', authenticate, toggleCheckupStatus);

export default router;
