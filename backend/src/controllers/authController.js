import authService from '../services/authService.js';

/**
 * AuthController
 *
 * Handles authentication-related HTTP flows.
 * Responsible for translating request credentials into
 * service-layer authentication operations and returning
 * normalized auth responses.
 *
 * Security boundary:
 * - Input validation occurs upstream.
 * - Password handling and token generation are isolated
 *   inside the service layer.
 */
class AuthController {
	/**
	 * Registers a new user account.
	 *
	 * Contract:
	 * - Expects validated username, email, and password.
	 * - Service layer handles hashing and persistence.
	 * - Returns an authentication token upon success.
	 */
	async signup(req, res, next) {
		try {
			const { username, email, password } = req.body;

			const result = await authService.signup({ username, email, password });

			res.status(201).json({
				success: true,
				message: 'User registered successfully',
				data: {
					user: result.user,
					token: result.token,
				},
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Authenticates an existing user.
	 *
	 * Contract:
	 * - Expects validated credentials.
	 * - Service layer verifies password and issues token.
	 * - Returns user profile and access token.
	 */
	async login(req, res, next) {
		try {
			const { email, password } = req.body;

			const result = await authService.login({ email, password });

			res.status(200).json({
				success: true,
				message: 'Login successful',
				data: {
					user: result.user,
					token: result.token,
				},
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Returns the authenticated user's profile.
	 *
	 * Trust boundary:
	 * - req.user must be populated by auth middleware.
	 * - No database access occurs in this controller.
	 */
	async getCurrentUser(req, res, next) {
		try {
			res.status(200).json({
				success: true,
				data: {
					user: req.user,
				},
			});
		} catch (error) {
			next(error);
		}
	}
}

export default new AuthController();
