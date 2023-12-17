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

module.exports = {
  dummy,
  favoriteBlog,
  totalLikes,
};
