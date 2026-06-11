import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

// Fail fast with a clear message instead of a buried Cloudinary error
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error(
    '[cloudinary] Missing env variables. Got:\n' +
    `  CLOUDINARY_CLOUD_NAME = ${CLOUDINARY_CLOUD_NAME}\n` +
    `  CLOUDINARY_API_KEY    = ${CLOUDINARY_API_KEY}\n` +
    `  CLOUDINARY_API_SECRET = ${CLOUDINARY_API_SECRET ? '(set)' : 'undefined'}`
  );
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key:    CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export default cloudinary;