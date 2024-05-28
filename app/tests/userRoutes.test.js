import request from 'supertest';
import express from 'express';
import addRoutes from '../routes/userRoutes.js';
import { createUser, editUser } from '../controllers/userController.js';

jest.mock('../controllers/userController.js', () => ({
  createUser: jest.fn((req, res) => {
    if (req.body.username && req.body.password) {
      return res.sendStatus(201);
    } else {
      return res.sendStatus(400);
    }
  }),
  editUser: jest.fn((req, res) => {
    if (req.params.id && req.body.username) {
      return res.sendStatus(200);
    } else {
      return res.sendStatus(400);
    }
  }),
}));

jest.mock('../middleware/authMiddleware.js', () => ({
  protect: jest.fn((req, res, next) => next()),
  admin: jest.fn((req, res, next) => next()),
}));

describe('userRoutes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    addRoutes(app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/users/create - should create a user', async () => {
    const res = await request(app)
      .post('/api/users/create')
      .send({ username: 'test', password: 'test' });

    expect(res.statusCode).toEqual(201);
    expect(createUser).toHaveBeenCalled();
  });

  test('POST /api/users/create - should not create a user without username or password', async () => {
    const res = await request(app)
      .post('/api/users/create')
      .send({ username: '', password: '' });

    expect(res.statusCode).toEqual(400);
    expect(createUser).toHaveBeenCalled();
  });

  test('PUT /api/users/edit/:id - should edit a user', async () => {
    const res = await request(app)
      .put('/api/users/edit/1')
      .send({ username: 'test' });

    expect(res.statusCode).toEqual(200);
    expect(editUser).toHaveBeenCalled();
  });

  test('PUT /api/users/edit/:id - should not edit a user without an id or username', async () => {
    const res = await request(app)
      .put('/api/users/edit/2')
      .send({ username: '' });

    expect(res.statusCode).toEqual(400);
    expect(editUser).toHaveBeenCalled();
  });
});