import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

/**
 * User routes.
 *
 * Defines public endpoints for retrieving user-facing profile data.
 * These routes expose read-only user information and associated content
 * without requiring authentication.
 */

// Public user profile retrieval route
router.get('/:username', userController.getUserProfile);

export default router;
