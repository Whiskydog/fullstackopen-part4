const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app/app');
const User = require('../models/user');
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await new User({
    username: 'bradpitt',
    passwordHash: 'SomeHashValue',
    name: 'Brad Pitt',
  }).save();
});

describe('when creating users', () => {
  test('a valid user is added', async () => {
    const user = {
      username: 'peterjackson',
      password: 'mysecret',
      name: 'Peter Jackson',
    };

    const response = await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.username).toBe(user.username);
    expect(response.body.name).toBe(user.name);
  });

  test('a duplicated username is rejected', async () => {
    const user = {
      username: 'bradpitt',
      password: 'doesntmatter',
      name: 'Brad Pitt',
    };

    const response = await api.post('/api/users').send(user).expect(400);
    expect(response.body.error).toMatch('Username must be unique');
  });

  test('a user missing their username is rejected', async () => {
    const user = {
      password: 'mysecret',
      name: 'Peter Jackson',
    };

    const response = await api.post('/api/users').send(user).expect(400);
    expect(response.body.error).toMatch(/Missing username/);
  });

  test('a user missing their password is rejected', async () => {
    const user = {
      username: 'peterjackson',
      name: 'Peter Jackson',
    };

    const response = await api.post('/api/users').send(user).expect(400);
    expect(response.body.error).toMatch(
      /Password must be at least 3 characters long/
    );
  });

  test('a user with a username too short is rejected', async () => {
    const user = {
      username: 'pe',
      password: 'mysecret',
      name: 'Peter Jackson',
    };

    const response = await api.post('/api/users').send(user).expect(400);
    expect(response.body.error).toMatch(
      /Username must be at least 3 characters long/
    );
  });

  test('a user with a password too short is rejected', async () => {
    const user = {
      username: 'peterjackson',
      password: 'my',
      name: 'Peter Jackson',
    };

    const response = await api.post('/api/users').send(user).expect(400);
    expect(response.body.error).toMatch(
      /Password must be at least 3 characters long/
    );
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
