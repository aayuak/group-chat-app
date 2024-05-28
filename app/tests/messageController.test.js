import { sendMessage } from '../controllers/messageController.js';
import Message from '../models/Message.js';
import Group from '../models/Group.js';

jest.mock('../models/Message.js');
jest.mock('../models/Group.js');

describe('messageController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sendMessage should return 404 if group is not found', async () => {
    const req = { body: { groupId: '1', content: 'Hello' }, user: { _id: '1', isAdmin: false } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    Group.findOne.mockResolvedValue(null);

    await sendMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Group not found' });
  });

  test('sendMessage should return 403 if user is not a member of the group', async () => {
    const req = { body: { groupId: '1', content: 'Hello' }, user: { _id: '1', isAdmin: false } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const group = { members_ids: ['2'], is_deleted: false };
    Group.findOne.mockResolvedValue(group);

    await sendMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'You are not a member of this group' });
  });

  test('sendMessage should create a message and return 201', async () => {
    const req = { body: { groupId: '1', content: 'Hello' }, user: { _id: '1', isAdmin: false } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const group = { members_ids: ['1'], is_deleted: false };
    const message = { save: jest.fn().mockResolvedValue(true) };
    Group.findOne.mockResolvedValue(group);
    Message.mockReturnValue(message);

    await sendMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(message);
  });
});