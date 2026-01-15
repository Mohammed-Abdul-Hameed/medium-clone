import User from '../models/User.js';
import authService from '../services/authService.js';
import { ApiError } from '../utils/ApiError.js';

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = authService.verifyToken(token);

    // Get user from token
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
