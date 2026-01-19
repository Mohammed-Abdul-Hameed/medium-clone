import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Global error-handling middleware.
 *
 * Responsibility:
 * - Normalizes all thrown errors into a consistent API response format.
 * - Converts unknown errors into ApiError instances to enforce uniform structure.
 * - Optionally exposes stack traces in development environments for debugging.
 *
 * This middleware must be registered after all routes and controllers.
 */
export const errorHandler = (err, req, res, next) => {
	let error = err;

	// Convert non-ApiError exceptions into standardized ApiError instances
	if (!(error instanceof ApiError)) {
		const statusCode = error.statusCode || 500;
		const message = error.message || 'Internal Server Error';
		error = new ApiError(statusCode, message);
	}

	// Build consistent error response payload
	const response = {
		success: false,
		message: error.message,
		...(error.errors.length > 0 && { errors: error.errors }),
	};

	// Expose stack trace only in non-production environments
	if (config.nodeEnv === 'development') {
		response.stack = error.stack;
	}

	res.status(error.statusCode).json(response);
};

/**
 * Fallback handler for undefined routes.
 *
 * Responsibility:
 * - Captures requests to non-existent endpoints.
 * - Generates a standardized NOT_FOUND ApiError.
 * - Forwards the error to the global error handler.
 *
 * This middleware should be registered after all route definitions.
 */
export const notFoundHandler = (req, res, next) => {
	const error = ApiError.notFound(`Route ${req.originalUrl} not found`);
	next(error);
};
