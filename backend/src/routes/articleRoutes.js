import express from 'express';
import articleController from '../controllers/articleController.js';
import { createArticleSchema, updateArticleSchema, validate } from '../middleware/articleValidation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticle);

// Protected routes
router.post('/', authMiddleware, validate(createArticleSchema), articleController.createArticle);
router.put('/:id', authMiddleware, validate(updateArticleSchema), articleController.updateArticle);
router.delete('/:id', authMiddleware, articleController.deleteArticle);

export default router;
