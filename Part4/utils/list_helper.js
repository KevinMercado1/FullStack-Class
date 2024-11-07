// utils/list_helper.js

const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  const favorite = blogs.reduce((prev, current) =>
    prev.likes > current.likes ? prev : current
  );
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  const authorCounts = {};
  blogs.forEach((blog) => {
    authorCounts[blog.author] = (authorCounts[blog.author] || 0) + 1;
  });

  const topAuthor = Object.keys(authorCounts).reduce((a, b) =>
    authorCounts[a] > authorCounts[b] ? a : b
  );

  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor],
  };
};

const mostLikes = (blogs) => {
  const authorLikes = {};
  blogs.forEach((blog) => {
    authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes;
  });

  const topAuthor = Object.keys(authorLikes).reduce((a, b) =>
    authorLikes[a] > authorLikes[b] ? a : b
  );

  return {
    author: topAuthor,
    likes: authorLikes[topAuthor],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
