const bcrypt = require('bcrypt');
const User = require('../models/user');

const usersRouter = require('express').Router();

usersRouter.get('/', async (_request, response, next) => {
  try {
    const users = await User.find({}).populate(
      'blogs',
      'title author url likes'
    );
    response.json(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.post('/', async (request, response, next) => {
  const { username, password, name } = request.body;

  try {
    if (!password || password.length < 3)
      throw new TypeError('Password must be at least 3 characters long');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await new User({
      username,
      passwordHash,
      name,
    }).save();
    response.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
