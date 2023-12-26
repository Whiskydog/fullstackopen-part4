const { expressjwt: jwt } = require('express-jwt');
const mongoose = require('mongoose');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

const jwtMiddleware = jwt({
  secret: process.env.SECRET,
  algorithms: ['HS256'],
});

blogsRouter.post('/', jwtMiddleware);
blogsRouter.delete('/:id', jwtMiddleware);

blogsRouter.get('/', async (_request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', 'username name');
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post('/', async (request, response, next) => {
  try {
    const user = await User.findById(request.auth.id);
    const blog = new Blog({ ...request.body, user: user._id });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response
      .status(201)
      .json(await savedBlog.populate('user', 'username name'));
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  const blogId = request.params.id;
  const tokenUserId = request.auth.id;

  try {
    const blog = await Blog.findById(blogId, 'user');
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' });
    }
    if (blog.user.toString() !== tokenUserId) {
      return response.status(401).json({ error: 'Unauthorized deletion' });
    }

    await Blog.findByIdAndDelete(blogId);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params;
  const update = {
    ...request.body,
    user: new mongoose.Types.ObjectId(request.body.user),
  };
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, update, {
      new: true,
    });
    if (updatedBlog) {
      response.json(await updatedBlog.populate('user', 'username name'));
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
