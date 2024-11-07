const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const MONGODB_URI = process.env.MONGODB_URI;

let token;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }

  await User.deleteMany({ username: 'testuser' });

  const user = new User({
    username: 'testuser',
    passwordHash: 'hashedpassword',
  });

  await user.save();

  const userForToken = {
    username: 'testuser',
    id: user._id,
  };

  token = jwt.sign(userForToken, process.env.SECRET);
});

beforeEach(async () => {
  await Blog.deleteMany({});

  const initialBlog = new Blog({
    title: 'Initial Blog',
    author: 'Initial Author',
    url: 'http://initialblog.com',
    likes: 0,
  });
  await initialBlog.save();
});

afterAll(async () => {
  await mongoose.connection.close();
});

jest.setTimeout(10000);

describe('Blog API', () => {
  test('GET /api/blogs returns correct amount of blog posts', async () => {
    const response = await supertest(app).get('/api/blogs');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test('POST /api/blogs creates a new blog post', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'http://newblog.com',
      likes: 5,
    };

    await supertest(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201);

    const response = await supertest(app).get('/api/blogs');
    expect(response.body).toHaveLength(2);
  });
});
