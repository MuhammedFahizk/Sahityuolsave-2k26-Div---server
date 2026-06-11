import cloudinary from '../config/cloudinary.js';

// ── UPLOAD IMAGE ──
export const uploadImage = (buffer, folder = 'festival/images') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,                    
        resource_type: 'image',
        transformation: [
          { quality: 'auto' },     
          { fetch_format: 'auto' } 
        ],
      },
      (error, result) => {
        if (error) 
          { reject(error);
        console.log('Cloudinary upload result:', result);
          }
        else resolve(result);
      }
    );
    stream.end(buffer); // send buffer to Cloudinary
  });
};

// ── UPLOAD VIDEO ──
export const uploadVideo = (buffer, folder = 'festival/videos') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'video',   
        chunk_size: 6000000,      
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// ── DELETE MEDIA (image or video) ──
export const deleteMedia = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};
