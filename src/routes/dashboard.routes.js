import { Router }  from 'express';
import controllers from '../controllers/index.js';
import { protect } from '../middleware/index.js';

const router = Router();

router.get('/stats', protect, controllers.getStats);

export default router;