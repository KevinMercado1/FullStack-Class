const express = require('express');
const Blog = require('../models/blog');
const userExtractor = require('../middlewares/auth');
const blogsRouter = express.Router();

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post('/', userExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: 'title or url missing' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
  });

  const savedBlog = await blog.save();

  const user = req.user;

  if (!user.blogs) {
    user.blogs = [];
  }

  user.blogs = user.blogs.concat(savedBlog._id);

  res.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);

  if (!blog) {
    return res.status(404).json({ error: 'blog not found' });
  }

  if (blog.user.toString() !== req.user.id) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  await Blog.findByIdAndRemove(id);
  res.status(204).end();
});

blogsRouter.put('/:id', userExtractor, async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { likes },
    { new: true }
  );
  res.json(updatedBlog);
});

module.exports = blogsRouter;
