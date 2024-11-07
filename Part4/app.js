require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const blogsRouter = require('./routes/blogs');
const usersRouter = require('./models/User');
const loginRouter = require('./controllers/login');
const cors = require('cors');
const middleware = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(middleware.tokenExtractor);
app.use('/api/login', loginRouter);
app.use('/api/users', usersRouter);
app.use(express.json());
app.use('/api/blogs', blogsRouter);

// MongoDB connection URI
const mongoDBUri = process.env.MONGODB_URI;
// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoDBUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the process if unable to connect
  }
};

// Connect to the database
connectDB();

// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
