import express from 'express';
import { createGroup, deleteGroup, addMember, getGroupsList, getGroup } from '../controllers/groupController.js';
import { protect } from '../middleware/authMiddleware.js';

const addRoutes = (app) => {
  app.use('/api/groups', (() => {
    const router = new express.Router({
      mergeParams: true,
    });

    router.post('/create', protect, createGroup);
    router.delete('/delete/:id', protect, deleteGroup);
    router.post('/addMember', protect, addMember);
    router.get('/list', protect, getGroupsList);
    router.get('/group/:id', protect, getGroup);

    return router;
  })());
};

export default addRoutes;