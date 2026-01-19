import { z } from 'zod';
import { ApiError } from '../utils/ApiError.js';

/**
 * Authentication validation schemas.
 *
 * These schemas define the input contract for authentication endpoints.
 * They prevent malformed credential payloads from reaching the service layer
 * and ensure consistent validation error responses across auth operations.
 */

// Validation schema for user registration payload
export const signupSchema = z.object({
	username: z
		.string()
		.min(3, 'Username must be at least 3 characters')
		.max(30, 'Username must be less than 30 characters')
		.regex(
			/^[a-zA-Z0-9_-]+$/,
			'Username can only contain letters, numbers, underscores, and hyphens',
		),
	email: z.string().email('Please provide a valid email'),
	password: z
		.string()
		.min(6, 'Password must be at least 6 characters')
		.max(100, 'Password is too long'),
});

// Validation schema for login payload
export const loginSchema = z.object({
	email: z.string().email('Please provide a valid email'),
	password: z.string().min(1, 'Password is required'),
});

/**
 * Generic request validation middleware factory.
 *
 * Responsibility:
 * - Validates incoming request bodies against a provided Zod schema.
 * - Converts schema validation failures into standardized API errors.
 * - Forwards all errors to centralized error-handling middleware.
 *
 * This ensures controllers remain free of validation logic and
 * guarantees uniform error structures across the authentication domain.
 */
export const validate = (schema) => {
	return (req, res, next) => {
		try {
			schema.parse(req.body);
			next();
		} catch (error) {
			// Normalize Zod validation errors into API-consumable format
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
