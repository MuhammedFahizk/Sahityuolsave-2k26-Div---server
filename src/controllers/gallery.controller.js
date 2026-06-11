import cloudinary from '../config/cloudinary.js';
import { GalleryPhoto, GalleryVideo } from '../models/index.js';
import { uploadImage, uploadVideo, deleteMedia } from '../utils/index.js';

// ── PHOTOS ──

export const getAllPhotos = async (req, res) => {
  try {
    const filter = {};
    const token = req.headers['x-admin-token'];
    if (!token) filter.published = true;
    if (req.query.album) filter.album = req.query.album;

    const photos = await GalleryPhoto.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: photos.length, data: photos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAlbums = async (req, res) => {
  try {
    const albums = await GalleryPhoto.distinct('album');
    res.status(200).json({ success: true, data: albums.filter(Boolean) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const { caption, album } = req.body;
    const result = await uploadImage(req.file.buffer, 'festival/gallery');

    const photo = await GalleryPhoto.create({
      imageUrl: result.secure_url,
      publicId: result.public_id,
      caption: caption || '',
      album: album || 'General',
      published: false,
    });

    res.status(201).json({ success: true, message: 'Photo uploaded', data: photo });
  } catch (error) {
    console.error('[uploadPhoto]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePhoto = async (req, res) => {
  try {
    const photo = await GalleryPhoto.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    if (!photo) return res.status(404).json({ success: false, message: 'Photo not found' });
    res.status(200).json({ success: true, data: photo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    const photo = await GalleryPhoto.findById(req.params.id);
    if (!photo) return res.status(404).json({ success: false, message: 'Photo not found' });

    await deleteMedia(photo.publicId, 'image');
    await GalleryPhoto.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Photo deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── VIDEOS ──

export const getAllVideos = async (req, res) => {
  try {
    const filter = {};
    const token = req.headers['x-admin-token'];
    if (!token) filter.published = true;

    const videos = await GalleryVideo.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: videos.length, data: videos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addVideo = async (req, res) => {
  try {
    const { title, type, url } = req.body;

    if (!title || !type) {
      return res.status(400).json({ success: false, message: 'Title and type are required' });
    }

    let videoUrl     = url || '';
    let publicId     = '';
    let thumbnailUrl = '';

    if (type === 'cloudinary') {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No video file provided' });
      }

      const result = await uploadVideo(req.file.buffer, 'festival/videos');
      videoUrl  = result.secure_url;
      publicId  = result.public_id;

      // ── Auto-generate thumbnail from the uploaded video ───────────────────
      // Cloudinary derives a JPG thumbnail from any video public_id.
      // so_auto = best frame, f_jpg = force JPEG, q_auto = optimized quality.
      // No extra upload needed — this URL works immediately after upload.
      thumbnailUrl = cloudinary.url(publicId, {
        resource_type: 'video',
        format:        'jpg',
        transformation: [
          { start_offset: 'auto' },   // best auto-detected frame
          { quality: 'auto' },
          { width: 640, crop: 'fill' },
        ],
      });

    } else if (type === 'youtube') {
      if (!url) {
        return res.status(400).json({ success: false, message: 'YouTube URL is required' });
      }

      // Handle all YouTube URL formats:
      // https://www.youtube.com/watch?v=VIDEO_ID
      // https://youtu.be/VIDEO_ID
      // https://www.youtube.com/embed/VIDEO_ID  ← already an embed URL
      const ytId = url.match(/(?:v=|youtu\.be\/|embed\/)([^&?\s/]{11})/)?.[1];
      videoUrl     = ytId ? `https://www.youtube.com/embed/${ytId}` : url;

      // maxresdefault → highest quality; falls back to hqdefault if not available
      thumbnailUrl = ytId
        ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
        : '';
    }

    const video = await GalleryVideo.create({
      title,
      type,
      url:          videoUrl,
      publicId,
      thumbnailUrl,
      published:    false,
    });

    res.status(201).json({ success: true, message: 'Video added', data: video });
  } catch (error) {
    console.error('[addVideo]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const video = await GalleryVideo.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    res.status(200).json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await GalleryVideo.findById(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });

    if (video.type === 'cloudinary' && video.publicId) {
      await deleteMedia(video.publicId, 'video');
    }

    await GalleryVideo.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};





export const getCombinedFeed = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 18);

    // Fetch both collections in parallel — only the fields the feed needs
    const [photos, videos] = await Promise.all([
      GalleryPhoto.find({published: true}).select('imageUrl caption album createdAt').lean(),
      GalleryVideo.find({published: true}).select('title type url thumbnailUrl createdAt').lean(),
    ]);

    // Normalize to unified shape
    const normalized = [
      ...photos.map(p => ({
        _id: p._id,
        mediaType: 'photo',
        url: p.imageUrl,
        thumbnailUrl: p.imageUrl,
        caption: p.caption || '',
        album: p.album || '',
        createdAt: p.createdAt,
      })),
      ...videos.map(v => ({
        _id: v._id,
        mediaType: v.type === 'youtube' ? 'youtube' : 'cloudinary_video',
        url: v.url,
        thumbnailUrl: v.thumbnailUrl || '',
        caption: v.title || '',
        album: null,
        createdAt: v.createdAt,
      })),
    ];

    // Sort newest first, then slice for this page
    normalized.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = normalized.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const data = normalized.slice((page - 1) * limit, page * limit);

    res.status(200).json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
        photoCount: photos.length,
        videoCount: videos.length,
      },
    });
  } catch (error) {
    console.error('[getCombinedFeed]', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
