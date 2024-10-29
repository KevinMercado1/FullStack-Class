require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const PersonsRouter = require('./router/persons');

const app = express();
const PORT = process.env.PORT || 3001;

const url = process.env.MONGODB_URI;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/persons', PersonsRouter);

// Rutas para contenido estático
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.use((error, req, res, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message });
  }
  next(error);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
