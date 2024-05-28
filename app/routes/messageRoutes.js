import express from 'express';
import { sendMessage, likeMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const addRoutes = (app) => {
  app.use('/api/messages', (() => {
    const router = new express.Router({
      mergeParams: true,
    });

    router.post('/send', protect, sendMessage);
    router.post('/like/:id', protect, likeMessage);

    return router;
  })());
};

export default addRoutes;