import dotenv from 'dotenv';

dotenv.config();

/**
 * List of environment variables that are mandatory
 * for the application to boot correctly.
 * Absence of any of these indicates a misconfigured runtime.
 */
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];

/**
 * Validate presence of critical environment variables
 * before exporting runtime configuration.
 * Failing fast here prevents undefined behavior later
 * during database or authentication initialization.
 */
requiredEnvVars.forEach((varName) => {
	if (!process.env[varName]) {
		throw new Error(`Missing required environment variable: ${varName}`);
	}
});

/**
 * Centralized application configuration object.
 * All environment-dependent values are normalized here
 * to avoid scattered process.env usage across the codebase.
 */
export const config = {
	// Network and runtime environment configuration
	port: process.env.PORT || 5000,
	nodeEnv: process.env.NODE_ENV || 'development',

	// Database configuration namespace
	mongodb: {
		uri: process.env.MONGODB_URI,
	},

	// JWT authentication configuration namespace
	jwt: {
		// Secret used to sign and verify access tokens
		secret: process.env.JWT_SECRET,

		// Token lifetime; defaults to 7 days if not explicitly set
		expiresIn: process.env.JWT_EXPIRES_IN || '7d',
	},

	// Frontend client configuration (used for CORS and redirects)
	client: {
		url: process.env.CLIENT_URL || 'http://localhost:5173',
	},
};
