import request from 'supertest';
import express from 'express';
import addRoutes from '../routes/authRoutes.js';
import { login, logout } from '../controllers/authController.js';

jest.mock('../controllers/authController.js', () => ({
  login: jest.fn((req, res) => {
    if (req.body.username === 'test' && req.body.password === 'test123') {
      return res.sendStatus(200);
    } else {
      return res.sendStatus(401);
    }
  }),
  logout: jest.fn((req, res) => res.sendStatus(200)),
}));

describe('authRoutes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    addRoutes(app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/auth/login - should log in a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'test', password: 'test123' });

    expect(res.statusCode).toEqual(200);
    expect(login).toHaveBeenCalled();
  });

  test('POST /api/auth/login - should not log in a user with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'wrong', password: 'wrong' });

    expect(res.statusCode).toEqual(401);
    expect(login).toHaveBeenCalled();
  });

  test('POST /api/auth/logout - should log out a user', async () => {
    const res = await request(app)
      .post('/api/auth/logout');

    expect(res.statusCode).toEqual(200);
    expect(logout).toHaveBeenCalled();
  });
});