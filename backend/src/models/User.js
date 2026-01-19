import mongoose from 'mongoose';

/**
 * User schema definition.
 *
 * Represents a registered platform user.
 * Stores authentication credentials, public profile fields,
 * and enforces uniqueness and format constraints at the database level.
 */
const userSchema = new mongoose.Schema(
	{
		// Unique public username used for profile identification
		username: {
			type: String,
			required: [true, 'Username is required'],
			unique: true,
			trim: true,
			minlength: [3, 'Username must be at least 3 characters'],
			maxlength: [30, 'Username must be less than 30 characters'],
			match: [
				/^[a-zA-Z0-9_-]+$/,
				'Username can only contain letters, numbers, underscores, and hyphens',
			],
		},

		// Unique email address used for authentication and account recovery
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
		},

		// Hashed user password (never exposed in query results)
		passwordHash: {
			type: String,
			required: [true, 'Password is required'],
			select: false, // Exclude from query results by default for security
		},

		// Optional public biography displayed on user profile
		bio: {
			type: String,
			maxlength: [200, 'Bio must be less than 200 characters'],
			default: '',
		},
	},
	{
		// Automatically track account creation and last update timestamps
		timestamps: true,
	},
);

/**
 * JSON transformation hook.
 *
 * Ensures sensitive and internal fields are removed
 * before user documents are serialized in API responses.
 */
userSchema.set('toJSON', {
	transform: (doc, ret) => {
		delete ret.passwordHash;
		delete ret.__v;
		return ret;
	},
});

const User = mongoose.model('User', userSchema);

export default User;
