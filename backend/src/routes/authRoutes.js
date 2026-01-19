import express from 'express';
import authController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { loginSchema, signupSchema, validate } from '../middleware/authValidation.js';

const router = express.Router();

/**
 * Authentication routes.
 *
 * Defines endpoints for user registration, login,
 * and authenticated user identity retrieval.
 * Input validation is enforced before controller execution,
 * and protected routes require a verified authentication context.
 */

// Public authentication endpoints
router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);

// Authenticated user endpoint
router.get('/me', authMiddleware, authController.getCurrentUser);

export default router;
