// # Sample Data Seeder Script
// # This script will populate your database with sample users and articles for testing

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import Article from './src/models/Article.js';
import { config } from './src/config/env.js';
import { connectDB } from './src/config/db.js';

/**
 * Sample user dataset.
 *
 * Used to generate initial test accounts for local development
 * and QA environments. Passwords are hashed at runtime before
 * persistence to simulate real authentication flows.
 */
const sampleUsers = [
	{
		username: 'johndoe',
		email: 'john@example.com',
		password: 'password123',
		bio: 'Tech enthusiast and full-stack developer',
	},
	{
		username: 'janedoe',
		email: 'jane@example.com',
		password: 'password123',
		bio: 'Writer, designer, and creative thinker',
	},
	{
		username: 'alexsmith',
		email: 'alex@example.com',
		password: 'password123',
		bio: 'Software engineer passionate about clean code',
	},
];

/**
 * Sample article dataset.
 *
 * Each entry represents article content to be inserted
 * and distributed across the created sample users.
 */
const sampleArticles = [
	{
		title: 'Getting Started with the MERN Stack',
		content: `The MERN stack has become one of the most popular tech stacks for building modern web applications...`,
	},
	{
		title: 'Understanding JWT Authentication',
		content: `JSON Web Tokens (JWT) have become the standard for securing web applications...`,
	},
	{
		title: 'React Best Practices in 2026',
		content: `React continues to evolve, and with it, our best practices...`,
	},
	{
		title: 'Building RESTful APIs with Express',
		content: `Express.js makes it incredibly easy to build RESTful APIs...`,
	},
	{
		title: 'MongoDB Schema Design Tips',
		content: `Designing your MongoDB schemas correctly from the start...`,
	},
	{
		title: 'CSS Grid vs Flexbox: When to Use Each',
		content: `Both CSS Grid and Flexbox are powerful layout tools...`,
	},
];

/**
 * Primary database seeding routine.
 *
 * Responsibility:
 * - Establishes database connection.
 * - Clears existing User and Article collections.
 * - Inserts sample users with securely hashed passwords.
 * - Inserts sample articles distributed among created users.
 * - Logs progress and summary for operator visibility.
 *
 * Intended usage:
 * - Local development environments.
 * - Testing and demonstration deployments.
 *
 * Not intended for production execution.
 */
async function seedDatabase() {
	try {
		// Initialize database connection
		await connectDB();

		// Remove existing records to ensure deterministic seeding
		console.log('Clearing existing data...');
		await User.deleteMany({});
		await Article.deleteMany({});

		// Create sample user accounts
		console.log('Creating sample users...');
		const createdUsers = [];

		for (const userData of sampleUsers) {
			// Hash plain-text passwords before storage
			const salt = await bcrypt.genSalt(10);
			const passwordHash = await bcrypt.hash(userData.password, salt);

			// Persist user record
			const user = await User.create({
				username: userData.username,
				email: userData.email,
				passwordHash,
				bio: userData.bio,
			});

			createdUsers.push(user);
			console.log(`✓ Created user: ${user.username}`);
		}

		// Create sample articles assigned to rotating authors
		console.log('Creating sample articles...');
		for (let i = 0; i < sampleArticles.length; i++) {
			const articleData = sampleArticles[i];
			const author = createdUsers[i % createdUsers.length]; // Rotate through users

			const article = await Article.create({
				title: articleData.title,
				content: articleData.content,
				author: author._id,
			});

			console.log(`✓ Created article: ${article.title}`);
		}

		// Output summary for verification
		console.log('\n Database seeded successfully!');
		console.log(`\n Summary:`);
		console.log(`  Users created: ${createdUsers.length}`);
		console.log(`  Articles created: ${sampleArticles.length}`);

		// Display test credentials for convenience in dev environments
		console.log(`\n Test credentials:`);
		sampleUsers.forEach((user) => {
			console.log(`   Email: ${user.email} | Password: ${user.password}`);
		});

		// Exit process after successful completion
		process.exit(0);
	} catch (error) {
		// Log and exit on failure to ensure CI/dev scripts detect failure state
		console.error(' Error seeding database:', error);
		process.exit(1);
	}
}

// Execute seeding routine
seedDatabase();
