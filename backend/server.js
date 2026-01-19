import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { config } from './src/config/env.js';

/**
 * Application entry point.
 *
 * Responsibility:
 * - Establishes database connection before server startup.
 * - Boots the Express application on the configured port.
 * - Registers graceful shutdown handlers for process termination signals.
 *
 * This file acts as the runtime orchestrator for the entire service.
 */

// Initialize MongoDB connection before accepting incoming requests
await connectDB();

/**
 * Start HTTP server.
 *
 * The server begins listening only after a successful
 * database connection to ensure runtime dependencies
 * are available before handling traffic.
 */
const server = app.listen(config.port, () => {
	console.log(`Server running on port ${config.port}`);
	console.log(`Environment: ${config.nodeEnv}`);
	console.log(`API: http://localhost:${config.port}`);
});

/**
 * Graceful shutdown handler.
 *
 * Listens for termination signals from the host environment
 * (e.g., Docker, Kubernetes, or system process manager)
 * and ensures active connections are closed before exit.
 */
process.on('SIGTERM', () => {
	console.log('SIGTERM received, shutting down gracefully');
	server.close(() => {
		console.log('Process terminated');
	});
});
