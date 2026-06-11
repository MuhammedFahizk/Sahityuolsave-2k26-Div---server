import { Router }  from 'express';
import controllers from '../controllers/index.js';
import { protect } from '../middleware/index.js';

const router = Router();

router.post('/login',  controllers.login);
router.post('/logout', protect, controllers.logout);

export default router;