
import { Router } from 'express';
const router = Router();


import { protect } from '../middleware/index.js';
import controllers from '../controllers/index.js';



router.get('/', controllers.getAllTemplates);
router.get('/:id', controllers.getTemplateById);

router.post('/', protect, controllers.createTemplate);
router.put('/:id', protect, controllers.updateTemplate);
router.delete('/:id', protect, controllers.deleteTemplate);


export default router;