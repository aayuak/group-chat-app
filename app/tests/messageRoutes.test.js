import request from 'supertest';
import express from 'express';
import addRoutes from '../routes/messageRoutes.js';
import { sendMessage, likeMessage } from '../controllers/messageController.js';

jest.mock('../controllers/messageController.js', () => ({
  sendMessage: jest.fn((req, res) => {
    if (req.body.content) {
      return res.sendStatus(201);
    } else {
      return res.sendStatus(400);
    }
  }),
  likeMessage: jest.fn((req, res) => {
    return res.sendStatus(200);
  }),
}));

jest.mock('../middleware/authMiddleware.js', () => ({
  protect: jest.fn((req, res, next) => next()),
}));

describe('messageRoutes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    addRoutes(app);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/messages/send - should send a message', async () => {
    const res = await request(app)
      .post('/api/messages/send')
      .send({ content: 'test message' });

    expect(res.statusCode).toEqual(201);
    expect(sendMessage).toHaveBeenCalled();
  });

  test('POST /api/messages/send - should not send a message without content', async () => {
    const res = await request(app)
      .post('/api/messages/send')
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(sendMessage).toHaveBeenCalled();
  });

  test('POST /api/messages/like/:id - should like a message', async () => {
    const res = await request(app)
      .post('/api/messages/like/1');

    expect(res.statusCode).toEqual(200);
    expect(likeMessage).toHaveBeenCalled();
  });

  test('POST /api/messages/like/:id - should not like a message without an id', async () => {
    const res = await request(app)
      .post('/api/messages/like/');

    expect(res.statusCode).toEqual(404);
  });
});