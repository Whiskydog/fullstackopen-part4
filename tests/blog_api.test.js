const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app/app');
const api = supertest(app);

const Blog = require('../models/blog');
const helper = require('./test_helper');

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogCount);
});

test('blogs have an id property', async () => {
  const response = await api.get('/api/blogs');
  const blogs = response.body;

  blogs.forEach((blog) => expect(blog.id).toBeDefined());
});

test('a blog can be created', async () => {
  const blog = {
    title: 'Software Architecture Guide',
    author: 'Martin Fowler',
    url: 'https://martinfowler.com/architecture/',
    likes: 100,
  };

  const response = await api
    .post('/api/blogs')
    .send(blog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogs = await helper.getBlogsInDatabase();

  expect(blogs).toHaveLength(helper.initialBlogCount + 1);
  expect(blogs).toContainEqual(response.body);
});

afterAll(async () => {
  await mongoose.connection.close();
});
