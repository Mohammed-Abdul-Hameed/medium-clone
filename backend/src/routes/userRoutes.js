import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// Public routes
router.get('/:username', userController.getUserProfile);

export default router;
