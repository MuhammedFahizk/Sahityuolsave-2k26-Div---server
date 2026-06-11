import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema(
  {
    title: {
      type:     String,
      required: [true, 'Title is required'],
      trim:     true,
    },
    content: {
      type:     String,  // stores Quill HTML output
      required: [true, 'Content is required'],
    },
    coverImageUrl: {
      type:    String,
      default: '',
    },
    coverImagePublicId: {
      type:    String,
      default: '',
    },
    category: {
      type:    String,
      enum:    ['Announcement', 'Update', 'Result', 'General'],
      default: 'General',
    },
    published: {
      type:    Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

newsSchema.index({ category: 1 });
newsSchema.index({ published: 1 });

const News = mongoose.model('News', newsSchema);
export default News;