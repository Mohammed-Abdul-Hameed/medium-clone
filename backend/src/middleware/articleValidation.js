import { z } from 'zod';
import { ApiError } from '../utils/ApiError.js';

/**
 * Article validation schemas.
 *
 * These schemas define the request payload contract for article operations.
 * They act as the first line of defense against malformed or incomplete input
 * before control reaches the service or database layers.
 */

// Validation schema for article creation payload
export const createArticleSchema = z.object({
	title: z
		.string()
		.min(3, 'Title must be at least 3 characters')
		.max(200, 'Title must be less than 200 characters'),
	content: z.string().min(10, 'Content must be at least 10 characters'),
});

// Validation schema for article update payload
// Supports partial updates but enforces that at least one field is provided
export const updateArticleSchema = z
	.object({
		title: z
			.string()
			.min(3, 'Title must be at least 3 characters')
			.max(200, 'Title must be less than 200 characters')
			.optional(),
		content: z.string().min(10, 'Content must be at least 10 characters').optional(),
	})
	.refine((data) => data.title || data.content, {
		message: 'At least one field (title or content) must be provided',
	});

/**
 * Generic request validation middleware factory.
 *
 * Responsibility:
 * - Validates incoming request bodies against a provided Zod schema.
 * - Transforms schema validation failures into standardized API errors.
 * - Forwards all errors to the centralized error-handling middleware.
 *
 * This keeps controllers free from validation logic and ensures
 * consistent error formatting across the application.
 */
export const validate = (schema) => {
	return (req, res, next) => {
		try {
			schema.parse(req.body);
			next();
		} catch (error) {
			// Normalize Zod validation errors into API-friendly format
			if (error instanceof z.ZodError) {
				const errors = error.errors.map((err) => ({
					field: err.path.join('.'),
					message: err.message,
				}));
				throw ApiError.badRequest('Validation failed', errors);
			}
			next(error);
		}
	};
};
