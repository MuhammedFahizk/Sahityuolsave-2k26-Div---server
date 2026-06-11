import { uploadImage, deleteMedia, uploadVideo } from "../utils/index.js";

export const uploadImageController = async (req, res) => {
  try {
    // Check file was sent
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided',
      });
    }

    // Optional folder from query param — default is festival/images
    // Example: /api/media/upload-image?folder=festival/teams
    const folder = req.query.folder || 'festival/images';

    const result = await uploadImage(req.file.buffer, folder);

    res.status(200).json({
      success:  true,
      message:  'Image uploaded successfully',
      url:      result.secure_url,  // save this in your form state
      publicId: result.public_id,   // save this too — needed for delete
      width:    result.width,
      height:   result.height,
      format:   result.format,
      bytes:    result.bytes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── UPLOAD VIDEO ──
// POST /api/media/upload-video
// Protected — admin only
export const uploadVideoController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No video file provided',
      });
    }

    const folder = req.query.folder || 'festival/videos';

    const result = await uploadVideo(req.file.buffer, folder);

    res.status(200).json({
      success:   true,
      message:   'Video uploaded successfully',
      url:       result.secure_url,
      publicId:  result.public_id,
      duration:  result.duration,  // video duration in seconds
      format:    result.format,
      bytes:     result.bytes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ── DELETE MEDIA ──
// DELETE /api/media/:publicId
// Protected — admin only
// Usage: if admin cancels form after uploading, clean up from Cloudinary
export const deleteMediaController = async (req, res) => {
  try {
    // publicId comes as URL param but Cloudinary uses / in publicId
    // so we pass it in body instead
    const { publicId, resourceType } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'publicId is required',
      });
    }

    const result = await deleteMedia(publicId, resourceType || 'image');

    // Cloudinary returns { result: 'ok' } on success
    if (result.result !== 'ok') {
      return res.status(400).json({
        success: false,
        message: 'Could not delete media — maybe already deleted',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};