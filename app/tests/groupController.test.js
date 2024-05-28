import { deleteGroup, addMember } from '../controllers/groupController.js';
import Group from '../models/Group.js';

jest.mock('../models/Group.js');

describe('groupController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deleteGroup should delete a group and return a success message', async () => {
    const req = { params: { id: '1' } };
    const res = { json: jest.fn() };
    Group.findByIdAndDelete.mockResolvedValue(true);

    await deleteGroup(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: 'Group deleted' });
  });

  test('addMember should return 404 if group is not found', async () => {
    const req = { body: { groupId: '1', userId: '1' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    Group.findOne.mockResolvedValue(null);

    await addMember(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Group not found' });
  });

  test('addMember should add a member to a group and return the updated group', async () => {
    const req = { body: { groupId: '1', userId: '1' } };
    const res = { json: jest.fn() };
    const group = { members_ids: [], is_deleted: false, save: jest.fn().mockResolvedValue(true) };
    Group.findOne.mockResolvedValue(group);

    await addMember(req, res);

    expect(res.json).toHaveBeenCalledWith(group);
    expect(group.members_ids).toContain('1');
  });
});