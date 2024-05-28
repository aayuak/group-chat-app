import express from 'express';
import { login, logout } from '../controllers/authController.js';

const addRoutes = (app) => {
  app.use('/api/auth', (() => {
    const router = new express.Router({
      mergeParams: true,
    });

    router.post('/login', login);
    router.post('/logout', logout);

    return router;
  })());
};

export default addRoutes;