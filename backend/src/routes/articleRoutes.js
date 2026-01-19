import express from 'express';
import articleController from '../controllers/articleController.js';
import {
	createArticleSchema,
	updateArticleSchema,
	validate,
} from '../middleware/articleValidation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Article routes.
 *
 * Defines HTTP endpoints for article resource operations.
 * Public routes allow read-only access to article content.
 * Protected routes require authentication and validated payloads
 * before delegating execution to controller handlers.
 */

// Public article retrieval routes
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticle);

// Protected article mutation routes
router.post('/', authMiddleware, validate(createArticleSchema), articleController.createArticle);
router.put('/:id', authMiddleware, validate(updateArticleSchema), articleController.updateArticle);
router.delete('/:id', authMiddleware, articleController.deleteArticle);

export default router;
