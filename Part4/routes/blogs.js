const express = require('express');
const Blog = require('../models/blog');
const middleware = require('../middleware/auth');
const blogsRouter = express.Router();

// Obtener todos los blogs
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post(
  '/',
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (req, res) => {
    const { title, author, url, likes } = req.body;
    const user = req.user;

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user._id,
    });

    try {
      const savedBlog = await blog.save();

      if (!user.blogs) {
        user.blogs = [];
      }

      user.blogs = user.blogs.concat(savedBlog._id);
      await user.save();

      // Responder con el blog recién creado
      res.status(201).json(savedBlog);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'An error occurred while saving the blog' });
    }
  }
);

blogsRouter.delete(
  '/:id',
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (req, res) => {
    const blog = await Blog.findById(req.params.id);

    if (blog.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: 'Unauthorized to delete this blog' });
    }

    try {
      await Blog.findByIdAndRemove(req.params.id);
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting the blog' });
    }
  }
);

module.exports = blogsRouter;
