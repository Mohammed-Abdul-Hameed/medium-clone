import express from 'express';
import authController from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { loginSchema, signupSchema, validate } from '../middleware/authValidation.js';

const router = express.Router();

// Public routes
router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);

// Protected routes
router.get('/me', authMiddleware, authController.getCurrentUser);

export default router;
