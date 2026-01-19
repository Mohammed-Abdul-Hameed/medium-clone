import User from '../models/User.js';
import authService from '../services/authService.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Authentication middleware.
 *
 * Responsibility:
 * - Extracts and verifies the JWT access token from the Authorization header.
 * - Resolves the authenticated user from the database.
 * - Attaches the user object to the request context for downstream handlers.
 *
 * Security boundary:
 * - Rejects requests with missing, malformed, or invalid tokens.
 * - Rejects requests referencing non-existent users.
 *
 * Expected header format:
 * Authorization: Bearer <token>
 */
export const authMiddleware = async (req, res, next) => {
	try {
		// Retrieve Authorization header from incoming request
		const authHeader = req.headers.authorization;

		// Ensure Bearer token is present before attempting verification
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw ApiError.unauthorized('No token provided');
		}

		// Extract raw JWT by removing the Bearer prefix
		const token = authHeader.substring(7);

		// Verify token integrity and decode payload
		const decoded = authService.verifyToken(token);

		// Resolve user associated with token payload
		const user = await User.findById(decoded.userId);

		// Reject request if token references a non-existent user
		if (!user) {
			throw ApiError.unauthorized('User not found');
		}

		// Attach authenticated user to request for downstream access control
		req.user = user;
		next();
	} catch (error) {
		// Forward authentication errors to centralized error handler
		next(error);
	}
};
