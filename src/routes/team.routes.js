import { Router } from 'express';
import controllers from '../controllers/index.js';
import { protect } from '../middleware/index.js';

const router = Router();

// Public routes
router.get('/', controllers.getAllTeams);
router.get('/:id', controllers.getTeamById);

// Protected routes — admin only
router.post('/', protect, controllers.createTeam);
router.put('/:id', protect, controllers.updateTeam);
router.delete('/:id', protect, controllers.deleteTeam);

export default router;