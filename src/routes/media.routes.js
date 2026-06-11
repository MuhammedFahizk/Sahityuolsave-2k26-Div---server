  import { Router }  from 'express';
  import controllers from '../controllers/index.js';
  import { protect, upload } from '../middleware/index.js';

  const router = Router();

  router.post(
    '/upload-image',
    protect,
    upload.single('image'),   
    controllers.uploadImageController
  );

  // Upload video
  router.post(
    '/upload-video',
    protect,
    upload.single('video'),  
    controllers.uploadVideoController
  );

  // Delete any media by publicId
  router.delete(
    '/delete',
    protect,
    controllers.deleteMediaController
  );

  export default router;