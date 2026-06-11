import mongoose from 'mongoose';

const galleryVideoSchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: [true, 'Title is required'],
      trim:     true,
    },
    type: {
      type:     String,
      enum:     ['youtube', 'cloudinary'],
      required: true,
    },
    // For YouTube — store the embed URL
    // For Cloudinary — store the video URL
    url: {
      type:     String,
      required: [true, 'URL is required'],
    },
    // Only for Cloudinary videos
    publicId: {
      type:    String,
      default: '',
    },
    // YouTube thumbnail or Cloudinary thumbnail
    thumbnailUrl: {
      type:    String,
      default: '',
    },
    published: {
      type:    Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const GalleryVideo = mongoose.model('GalleryVideo', galleryVideoSchema);
export default GalleryVideo;