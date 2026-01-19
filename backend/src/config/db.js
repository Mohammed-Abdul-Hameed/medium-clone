import mongoose from 'mongoose';
import { config } from './env.js';

/**
 * Initializes and maintains the MongoDB connection.
 *
 * This function must be executed once during application bootstrap.
 * The process will terminate immediately if the initial connection fails,
 * since database availability is a hard runtime dependency.
 *
 * Runtime connection listeners are registered to surface driver-level
 * connection events for observability and incident debugging.
 *
 * @returns {Promise<void>} Resolves when the initial database connection is established.
 */
export const connectDB = async () => {
	try {
		/**
		 * Establish primary connection using the configured MongoDB URI.
		 * Mongoose manages internal connection pooling automatically.
		 */
		const conn = await mongoose.connect(config.mongodb.uri);

		// Log connected host for operational visibility (useful in clustered deployments)
		console.log(`MongoDB connected on host: ${conn.connection.host}`);

		/**
		 * Connection event: emitted when the driver encounters an error
		 * after the initial successful connection.
		 * These errors do not always crash the process, so explicit logging
		 * is required for monitoring and alerting pipelines.
		 */
		mongoose.connection.on('error', (err) => {
			console.error('MongoDB runtime connection error:', err);
		});

		/**
		 * Connection event: emitted when the connection is lost.
		 * Mongoose will attempt auto-reconnection unless disabled.
		 * Logging is critical to correlate downtime with upstream incidents.
		 */
		mongoose.connection.on('disconnected', () => {
			console.warn('MongoDB connection lost. Awaiting reconnection...');
		});
	} catch (error) {
		/**
		 * Initial connection failure handler.
		 * If the database cannot be reached at startup,
		 * continuing to run the application is unsafe.
		 * Therefore, the process exits with a non-zero code
		 * to signal container/orchestrator restart policies.
		 */
		console.error('MongoDB initial connection failed:', error.message);
		process.exit(1);
	}
};
