const express = require('express');
const multer = require('multer');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { uploadBuffer } = require('../utils/cloudinary');

const router = express.Router();
const upload = multer();

router.get('/', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

router.post('/', auth, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const imageUrl = await uploadBuffer(req.file.buffer);

    const post = await Post.create({
      title: req.body.title,
      body: req.body.body,
      type: req.body.type,
      imageUrl,
      author: req.user.id
    });

    res.status(201).json(post);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

router.delete('/:id', auth, admin, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
