import mongoose from 'mongoose';

const galleryPhotoSchema = new mongoose.Schema(
  {
    imageUrl: {
      type:     String,
      required: [true, 'Image URL is required'],
    },
    publicId: {
      type:     String,
      required: true,
    },
    caption: {
      type:    String,
      trim:    true,
      default: '',
    },
    album: {
      type:    String,
      trim:    true,
      default: 'General',
    },
    published: {
      type:    Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

galleryPhotoSchema.index({ album: 1 });
galleryPhotoSchema.index({ published: 1 });

const GalleryPhoto = mongoose.model('GalleryPhoto', galleryPhotoSchema);
export default GalleryPhoto;