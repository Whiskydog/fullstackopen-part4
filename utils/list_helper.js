const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return undefined;
  return blogs.reduce((a, b) => (a.likes > b.likes ? a : b));
};

const mostBlogs = (blogs) => {
  const blogCounts = _.countBy(blogs, 'author');
  const authors = _.map(blogCounts, (blogs, author) => ({ author, blogs }));
  return _.maxBy(authors, 'blogs');
};

const mostLikes = (blogs) => {
  const blogGroups = _.groupBy(blogs, 'author');
  const authors = _.map(blogGroups, (blogs, author) => ({
    author,
    likes: blogs.reduce((acc, blog) => acc + blog.likes, 0),
  }));
  return _.maxBy(authors, 'likes');
};

module.exports = {
  dummy,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  totalLikes,
};
