
const express = require('express');
const multer = require('multer');
const streamifier = require('streamifier');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const cloudinary = require('../utils/cloudinary');

const router = express.Router();
const upload = multer();

router.get('/', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

router.post('/', auth, admin, upload.single('image'), async (req, res) => {
  let imageUrl = '';
  if (req.file) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((err, result) => {
        if (err) reject(err);
        resolve(result);
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
    imageUrl = result.secure_url;
  }

  const post = await Post.create({
    title: req.body.title,
    body: req.body.body,
    type: req.body.type,
    imageUrl,
    author: req.user.id
  });

  res.status(201).json(post);
});

router.delete('/:id', auth, admin, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
