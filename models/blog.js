const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: 'Missing blog title' },
  author: String,
  url: { type: String, required: 'Missing blog url' },
  likes: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

blogSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = doc._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
