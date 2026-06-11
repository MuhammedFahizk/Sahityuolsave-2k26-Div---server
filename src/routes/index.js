import { Router }   from 'express';
import authRoutes   from './auth.routes.js';
import teamRoutes   from './team.routes.js';
import mediaRoutes  from './media.routes.js';  
import resultRoutes from './result.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import newsRoutes from './news.routes.js';
import galleryRoutes from './gallery.routes.js';
import templateRoutes from './template.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/teams', teamRoutes);
router.use('/media', mediaRoutes); 
router.use('/results', resultRoutes); 
router.use('/dashboard', dashboardRoutes);
router.use('/news', newsRoutes);
router.use('/gallery', galleryRoutes);
router.use('/templates', templateRoutes);


export default router;