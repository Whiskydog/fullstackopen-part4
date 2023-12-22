const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const passwordCorrect = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!(user && passwordCorrect)) {
    return response.status(401).json({ error: 'Wrong username or password' });
  }

  const token = jwt.sign(
    { username: user.username, id: user._id },
    process.env.SECRET
  );

  response.json({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
