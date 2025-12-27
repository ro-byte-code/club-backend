const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const role = require('../middleware/roles');
const multer = require('multer');
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB
const { uploadBuffer } = require('../utils/cloudinary');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const q = type ? { type } : {};
    const posts = await Post.find(q)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('author', 'name');
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name');
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// create (admin only)
router.post('/', auth, role(['admin']), upload.single('image'), async (req, res) => {
  try {
    let imageUrl;
    if (req.file && req.file.buffer) {
      imageUrl = await uploadBuffer(req.file.buffer, 'club-app');
    }

    const { title, body, type, startsAt, endsAt, tags } = req.body;
    const tagsArr = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [];
    const post = new Post({
      title,
      body,
      type,
      imageUrl,
      author: req.user._id,
      startsAt: startsAt || null,
      endsAt: endsAt || null,
      tags: tagsArr
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, role(['admin']), async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, role(['admin']), async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
