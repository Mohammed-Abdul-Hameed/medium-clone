import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * AuthService
 *
 * Encapsulates authentication and authorization logic.
 * Responsible for user registration, credential verification,
 * password hashing, and JWT token lifecycle management.
 */
class AuthService {
	/**
	 * Registers a new user account.
	 *
	 * Contract:
	 * - Ensures email and username uniqueness.
	 * - Hashes user password before persistence.
	 * - Returns created user and issued authentication token.
	 *
	 * Failure modes:
	 * - BAD_REQUEST if email or username is already registered.
	 */
	async signup({ username, email, password }) {
		// Check for existing user with matching email or username
		const existingUser = await User.findOne({
			$or: [{ email }, { username }],
		});

		if (existingUser) {
			if (existingUser.email === email) {
				throw ApiError.badRequest('Email already registered');
			}
			throw ApiError.badRequest('Username already taken');
		}

		// Securely hash user password before storage
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(password, salt);

		// Persist new user record
		const user = await User.create({
			username,
			email,
			passwordHash,
		});

		// Issue JWT token for authenticated session
		const token = this.generateToken(user._id);

		return {
			user,
			token,
		};
	}

	/**
	 * Authenticates a user using email and password.
	 *
	 * Contract:
	 * - Retrieves stored password hash for comparison.
	 * - Issues a new authentication token upon success.
	 *
	 * Failure modes:
	 * - UNAUTHORIZED if credentials are invalid.
	 */
	async login({ email, password }) {
		// Locate user and explicitly include password hash for verification
		const user = await User.findOne({ email }).select('+passwordHash');

		if (!user) {
			throw ApiError.unauthorized('Invalid credentials');
		}

		// Compare supplied password against stored hash
		const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

		if (!isPasswordValid) {
			throw ApiError.unauthorized('Invalid credentials');
		}

		// Issue JWT token for authenticated session
		const token = this.generateToken(user._id);

		// Remove sensitive password hash before returning user object
		user.passwordHash = undefined;

		return {
			user,
			token,
		};
	}

	/**
	 * Generates a signed JWT for a given user identifier.
	 *
	 * Contract:
	 * - Embeds userId as token subject.
	 * - Uses configured secret and expiration policy.
	 */
	generateToken(userId) {
		return jwt.sign({ userId }, config.jwt.secret, {
			expiresIn: config.jwt.expiresIn,
		});
	}

	/**
	 * Verifies integrity and validity of a JWT.
	 *
	 * Failure mode:
	 * - UNAUTHORIZED if token is invalid or expired.
	 */
	verifyToken(token) {
		try {
			return jwt.verify(token, config.jwt.secret);
		} catch (error) {
			throw ApiError.unauthorized('Invalid or expired token');
		}
	}
}

export default new AuthService();
