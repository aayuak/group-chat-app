import { createUser, editUser } from '../controllers/userController.js';
import User from '../models/User.js';

jest.mock('../models/User.js');

describe('userController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createUser should create a user and return 201', async () => {
    const req = { body: { username: 'test', password: 'test', isAdmin: false } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const user = { save: jest.fn().mockResolvedValue(true) };
    User.mockReturnValue(user);

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  test('editUser should edit a user and return the updated user', async () => {
    const req = { params: { id: '1' }, body: { username: 'test', password: 'test', isAdmin: false } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    const user = { save: jest.fn().mockResolvedValue(true), username: 'old', password: 'old', isAdmin: true };
    User.findOne.mockResolvedValue(user);

    await editUser(req, res);

    expect(res.json).toHaveBeenCalledWith(user);
  });

  test('editUser should return 404 if user is not found', async () => {
    const req = { params: { id: '1' }, body: { username: 'test', password: 'test', isAdmin: false } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    User.findOne.mockResolvedValue(null);

    await editUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });
});