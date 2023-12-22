const config = require('../utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const blogsRouter = require('../controllers/blogs');
const usersRouter = require('../controllers/users');
const loginRouter = require('../controllers/login');
const errorHandler = require('../controllers/error');

console.log('Connecting to MongoDB');
mongoose
  .connect(config.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Connection refused:', error.message));

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use(errorHandler);

module.exports = app;
