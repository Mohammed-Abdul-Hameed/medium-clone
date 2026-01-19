import mongoose from 'mongoose';

/**
 * Article schema definition.
 *
 * Represents a published article within the platform.
 * Encapsulates content data, author relationship, and
 * automated slug generation for SEO-friendly URLs.
 */
const articleSchema = new mongoose.Schema(
	{
		// Human-readable article title
		title: {
			type: String,
			required: [true, 'Title is required'],
			trim: true,
			minlength: [3, 'Title must be at least 3 characters'],
			maxlength: [200, 'Title must be less than 200 characters'],
		},

		// URL-safe unique identifier derived from title
		slug: {
			type: String,
			unique: true,
			lowercase: true,
			index: true,
		},

		// Main article body content
		content: {
			type: String,
			required: [true, 'Content is required'],
			minlength: [10, 'Content must be at least 10 characters'],
		},

		// Reference to the authoring user
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Author is required'],
		},
	},
	{
		// Automatically maintain createdAt and updatedAt timestamps
		timestamps: true,
	},
);

/**
 * Pre-save hook to generate or update slug when title changes.
 *
 * Ensures every article has a URL-friendly unique slug
 * before being persisted to the database.
 */
articleSchema.pre('save', function (next) {
	if (this.isModified('title')) {
		this.slug = this.generateSlug(this.title);
	}
	next();
});

/**
 * Generates a URL-safe slug from a given title.
 *
 * Behavior:
 * - Normalizes casing.
 * - Replaces non-alphanumeric characters with hyphens.
 * - Appends a random suffix to guarantee uniqueness.
 */
articleSchema.methods.generateSlug = function (title) {
	const baseSlug = title
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	// Append random token to avoid slug collisions
	const randomString = Math.random().toString(36).substring(2, 8);
	return `${baseSlug}-${randomString}`;
};

const Article = mongoose.model('Article', articleSchema);

export default Article;
