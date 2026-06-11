import { News } from '../models/index.js';
import { uploadImage, deleteMedia } from '../utils/index.js';

// GET /api/news — public sees published only, admin sees all
export const getAllNews = async (req, res) => {
  try {
    const filter = {};
    const token = req.headers['x-admin-token'];
    if (!token) filter.published = true;
    if (req.query.category) filter.category = req.query.category;

    const news = await News.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: news.length, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllNewsPublic = async (req, res) => {
  try {
    const { category, page, limit } = req.query;
    const filter = { published: true };
    if (category) filter.category = category;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skipNum = (pageNum - 1) * limitNum;
    const news = await News.find(filter).sort({ createdAt: -1 }).skip(skipNum).limit(limitNum);
    const total = await News.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: news.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: news,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/news/:id
export const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: 'Post not found' });
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/news — admin only
export const createNews = async (req, res) => {
  try {
    const { title, content, category, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    // Handle cover image upload if file sent
    let coverImageUrl = '';
    let coverImagePublicId = '';
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'festival/news');
      coverImageUrl = result.secure_url;
      coverImagePublicId = result.public_id;
    }

    const news = await News.create({
      title, content, category, published,
      coverImageUrl, coverImagePublicId,
    });

    res.status(201).json({ success: true, message: 'Post created', data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/news/:id — admin only
export const updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: 'Post not found' });

    // Handle new cover image
    if (req.file) {
      // Delete old image from Cloudinary
      if (news.coverImagePublicId) {
        await deleteMedia(news.coverImagePublicId);
      }
      const result = await uploadImage(req.file.buffer, 'festival/news');
      req.body.coverImageUrl = result.secure_url;
      req.body.coverImagePublicId = result.public_id;
    }

    const updated = await News.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Post updated', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/news/:id — admin only
export const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: 'Post not found' });

    // Delete cover image from Cloudinary
    if (news.coverImagePublicId) {
      await deleteMedia(news.coverImagePublicId);
    }

    await News.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};