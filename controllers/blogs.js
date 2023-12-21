const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (_request, response, next) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post('/', async (request, response, next) => {
  const blog = new Blog(request.body);
  try {
    const result = await blog.save();
    response.status(201).json(result);
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
