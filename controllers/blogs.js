const { expressjwt: jwt } = require('express-jwt');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.post(
  '/',
  jwt({ secret: process.env.SECRET, algorithms: ['HS256'] })
);

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

    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params;
  try {
    await Blog.findByIdAndDelete(id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params;
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, request.body, {
      new: true,
    });
    if (updatedBlog) response.json(updatedBlog);
    else response.status(404).end();
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
