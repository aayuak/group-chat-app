import express from 'express';
import { createUser, editUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const addRoutes = (app) => {
  app.use('/api/users', (() => {
    const router = new express.Router({
      mergeParams: true,
    });

    router.post('/create', protect, admin, createUser);
    router.put('/edit/:id', protect, admin, editUser);

    return router;
  })());
};

export default addRoutes;