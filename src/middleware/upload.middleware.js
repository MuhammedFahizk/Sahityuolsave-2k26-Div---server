import multer from 'multer';

// Store file in memory — not on disk
const storage = multer.memoryStorage();

// File filter — only allow images and videos
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/mkv', 'video/webm'];
  const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // accept file
  } else {
    cb(new Error('Only images (jpg, png, webp) and videos (mp4, mkv, webm) are allowed'), false);
  }
};

// Size limits
const limits = {
  fileSize: 50 * 1024 * 1024, // 50MB max — covers both images and videos
};

const upload = multer({ storage, fileFilter, limits });

export default upload;