import { Router }  from 'express';
import controllers from '../controllers/index.js';
import { protect, upload } from '../middleware/index.js';

const router = Router();

router.get('/feed', controllers.getCombinedFeed);


// ── Photos ──
router.get('/photos',         controllers.getAllPhotos);
router.get('/photos/albums',  controllers.getAlbums);
router.post('/photos',        protect, upload.single('image'),  controllers.uploadPhoto);
router.put('/photos/:id',     protect,                          controllers.updatePhoto);
router.delete('/photos/:id',  protect,                          controllers.deletePhoto);

// ── Videos ──
router.get('/videos',         controllers.getAllVideos);
router.post('/videos',        protect, upload.single('video'),  controllers.addVideo);
router.put('/videos/:id',     protect,                          controllers.updateVideo);
router.delete('/videos/:id',  protect,                          controllers.deleteVideo);

export default router;