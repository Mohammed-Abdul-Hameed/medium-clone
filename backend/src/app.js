import cors from 'cors';
import express from 'express';
import { config } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import articleRoutes from './routes/articleRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

/**
 * Application bootstrap configuration.
 *
 * Responsible for initializing core middleware,
 * registering route modules, and attaching
 * global error-handling mechanisms.
 */

// Enable CORS with configured client origin for cross-origin requests
app.use(
	cors({
		origin: config.client.url,
		credentials: true,
	}),
);

// Parse incoming JSON payloads
app.use(express.json());

// Parse URL-encoded form payloads
app.use(express.urlencoded({ extended: true }));

/**
 * Health check endpoint.
 *
 * Provides a lightweight endpoint for uptime monitoring
 * and container orchestration readiness checks.
 */
app.get('/health', (req, res) => {
	res.json({ status: 'OK', message: 'Server is running' });
});

/**
 * Route registrations.
 *
 * Each route module encapsulates domain-specific endpoints
 * and delegates request handling to controllers.
 */
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);

/**
 * Global error handling registration.
 *
 * notFoundHandler catches undefined routes.
 * errorHandler normalizes and responds to all thrown errors.
 */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
