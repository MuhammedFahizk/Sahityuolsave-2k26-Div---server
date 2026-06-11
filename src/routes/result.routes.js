import { Router }  from 'express';
import controllers from '../controllers/index.js';
import { protect } from '../middleware/index.js';

const router = Router();

// ⚠️ /filters MUST come before /:id
// otherwise Express reads 'filters' as an :id param
router.get('/filters',  controllers.getFilters);

// Public
router.get('/',    controllers.getAllResults);
router.get('/public/', controllers.getResultByIdForPublic); 
router.get('/:id', controllers.getResultById);

// Protected — admin only
router.post('/',    protect, controllers.createResult);
router.put('/:id',  protect, controllers.updateResult);
router.delete('/:id', protect, controllers.deleteResult);

export default router;