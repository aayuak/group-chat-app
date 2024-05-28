import { login } from '../controllers/authController.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

jest.mock('../models/User.js');
jest.mock('jsonwebtoken');

describe('authController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('login should return 401 if user is not found', async () => {
    const req = { body: { username: 'test', password: 'test' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    User.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  test('login should return 401 if password does not match', async () => {
    const req = { body: { username: 'test', password: 'test' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const user = { matchPassword: jest.fn().mockResolvedValue(false) };
    User.findOne.mockResolvedValue(user);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  test('login should return a token if username and password match', async () => {
    const req = { body: { username: 'test', password: 'test' } };
    const res = { json: jest.fn() };
    const user = { _id: '1', isAdmin: false, matchPassword: jest.fn().mockResolvedValue(true) };
    const token = 'token';
    User.findOne.mockResolvedValue(user);
    jwt.sign.mockReturnValue(token);

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith({ token });
  });
});