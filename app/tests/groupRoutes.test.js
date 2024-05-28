import request from 'supertest';
import express from 'express';
import addRoutes from '../routes/groupRoutes.js';
import { createGroup, deleteGroup, addMember, getGroupsList, getGroup } from '../controllers/groupController.js';

jest.mock('../controllers/groupController.js', () => ({
  createGroup: jest.fn((req, res) => {
    if (req.body.name) {
      return res.sendStatus(201);
    } else {
      return res.sendStatus(400);
    }
  }),
  deleteGroup: jest.fn((req, res) => {
    return res.sendStatus(200);
  }),
  addMember: jest.fn((req, res) => {
    if (req.body.groupId && req.body.userId) {
      return res.sendStatus(200);
    } else {
      return res.sendStatus(400);
    }
  }),
  getGroupsList: jest.fn((req, res) => res.sendStatus(200)),
  getGroup: jest.fn((req, res) => {
    return res.sendStatus(200);
  }),
}));

jest.mock('../middleware/authMiddleware.js', () => ({
  protect: jest.fn((req, res, next) => next()),
}));

describe('groupRoutes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    addRoutes(app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/groups/create - should create a group', async () => {
    const res = await request(app)
      .post('/api/groups/create')
      .send({ name: 'test group' });

    expect(res.statusCode).toEqual(201);
    expect(createGroup).toHaveBeenCalled();
  });

  test('POST /api/groups/create - should not create a group without a name', async () => {
    const res = await request(app)
      .post('/api/groups/create')
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(createGroup).toHaveBeenCalled();
  });

  test('DELETE /api/groups/delete/:id - should delete a group', async () => {
    const res = await request(app)
      .delete('/api/groups/delete/1');

    expect(res.statusCode).toEqual(200);
    expect(deleteGroup).toHaveBeenCalled();
  });

  test('DELETE /api/groups/delete/:id - should not delete a group without an id', async () => {
    const res = await request(app)
      .delete('/api/groups/delete/');

    expect(res.statusCode).toEqual(404);
  });

  test('POST /api/groups/addMember - should add a member to a group', async () => {
    const res = await request(app)
      .post('/api/groups/addMember')
      .send({ groupId: '1', userId: '1' });

    expect(res.statusCode).toEqual(200);
    expect(addMember).toHaveBeenCalled();
  });

  test('POST /api/groups/addMember - should not add a member without groupId or userId', async () => {
    const res = await request(app)
      .post('/api/groups/addMember')
      .send({ groupId: '', userId: '' });

    expect(res.statusCode).toEqual(400);
    expect(addMember).toHaveBeenCalled();
  });

  test('GET /api/groups/list - should get a list of groups', async () => {
    const res = await request(app)
      .get('/api/groups/list');

    expect(res.statusCode).toEqual(200);
    expect(getGroupsList).toHaveBeenCalled();
  });

  test('GET /api/groups/group/:id - should get a group', async () => {
    const res = await request(app)
      .get('/api/groups/group/1');

    expect(res.statusCode).toEqual(200);
    expect(getGroup).toHaveBeenCalled();
  });

  test('GET /api/groups/group/:id - should not get a group without an id', async () => {
    const res = await request(app)
      .get('/api/groups/group/');

    expect(res.statusCode).toEqual(404);
  });
});