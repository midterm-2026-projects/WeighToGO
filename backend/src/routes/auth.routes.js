import { Router } from 'express';
import { loginController, logoutController, sessionController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/login', loginController);
router.post('/logout', authenticate, logoutController);
router.get('/session', authenticate, sessionController);

export default router;
