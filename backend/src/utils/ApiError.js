/**
 * ApiError
 *
 * Custom error class used to represent operational errors
 * within the application. Provides standardized HTTP status
 * codes, user-facing messages, and optional validation details.
 *
 * All domain and service-layer errors should be expressed
 * through this class to ensure consistent error handling.
 */
export class ApiError extends Error {
	constructor(statusCode, message, errors = []) {
		super(message);
		this.statusCode = statusCode;
		this.errors = errors;
		this.isOperational = true;

		// Capture clean stack trace excluding constructor call
		Error.captureStackTrace(this, this.constructor);
	}

	/**
	 * Generates a BAD_REQUEST (400) error.
	 * Commonly used for validation and malformed input failures.
	 */
	static badRequest(message = 'Bad Request', errors = []) {
		return new ApiError(400, message, errors);
	}

	/**
	 * Generates an UNAUTHORIZED (401) error.
	 * Used when authentication fails or token is missing/invalid.
	 */
	static unauthorized(message = 'Unauthorized') {
		return new ApiError(401, message);
	}

	/**
	 * Generates a FORBIDDEN (403) error.
	 * Used when authenticated users attempt unauthorized actions.
	 */
	static forbidden(message = 'Forbidden') {
		return new ApiError(403, message);
	}

	/**
	 * Generates a NOT_FOUND (404) error.
	 * Used when requested resources or routes do not exist.
	 */
	static notFound(message = 'Not Found') {
		return new ApiError(404, message);
	}

	/**
	 * Generates an INTERNAL_SERVER_ERROR (500).
	 * Used as a fallback for unexpected system failures.
	 */
	static internal(message = 'Internal Server Error') {
		return new ApiError(500, message);
	}
}
