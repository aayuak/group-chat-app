import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect, admin } from '../middleware/authMiddleware.js';

jest.mock('jsonwebtoken');
jest.mock('../models/User.js');

describe('Auth Middleware', () => {
  describe('protect', () => {
    it('should return 401 if no token is provided', async () => {
      const req = {
        headers: {}
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', async () => {
      const req = {
        headers: {
          authorization: 'Bearer invalidtoken'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should set req.user and call next if token is valid', async () => {
      const req = {
        headers: {
          authorization: 'Bearer validtoken'
        }
      };
      const res = {};
      const next = jest.fn();

      const decodedToken = { id: 'userId' };
      jwt.verify.mockReturnValue(decodedToken);
      User.findById.mockResolvedValue({ _id: 'userId', name: 'John Doe' });

      await protect(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('validtoken', process.env.JWT_SECRET);
      expect(User.findById).toHaveBeenCalledWith('userId');
      expect(req.user).toEqual({ _id: 'userId', name: 'John Doe' });
      expect(next).toHaveBeenCalled();
    });
  });

  describe('admin', () => {
    it('should return 403 if user is not admin', () => {
      const req = {
        user: {
          isAdmin: false
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      admin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Require admin role' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if user is admin', () => {
      const req = {
        user: {
          isAdmin: true
        }
      };
      const res = {};
      const next = jest.fn();

      admin(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
