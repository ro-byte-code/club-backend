const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, enum: ['news','event','announcement'], default: 'news' },
  imageUrl: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startsAt: { type: Date },
  endsAt: { type: Date },
  published: { type: Boolean, default: true },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
