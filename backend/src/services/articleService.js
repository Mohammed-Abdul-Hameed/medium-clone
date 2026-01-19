import Article from '../models/Article.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * ArticleService
 *
 * Encapsulates all business logic related to article management.
 * This layer owns database interactions, authorization checks,
 * and domain-specific error handling for article resources.
 */
class ArticleService {
	/**
	 * Creates and persists a new article.
	 *
	 * Contract:
	 * - Requires title, content, and authorId.
	 * - Automatically associates the article with its author.
	 * - Returns the created article with populated author details.
	 */
	async createArticle({ title, content, authorId }) {
		const article = await Article.create({
			title,
			content,
			author: authorId,
		});

		// Populate author reference for response consumption
		await article.populate('author', 'username email bio');

		return article;
	}

	/**
	 * Retrieves a paginated feed of articles.
	 *
	 * Contract:
	 * - Articles are sorted by creation date (newest first).
	 * - Supports limit and skip parameters for pagination.
	 * - Returns articles along with pagination metadata.
	 */
	async getAllArticles({ limit = 20, skip = 0 } = {}) {
		const articles = await Article.find()
			.populate('author', 'username email bio')
			.sort({ createdAt: -1 })
			.limit(limit)
			.skip(skip);

		const total = await Article.countDocuments();

		return {
			articles,
			total,
			limit,
			skip,
		};
	}

	/**
	 * Retrieves a single article by identifier.
	 *
	 * Lookup strategy:
	 * - Attempts resolution by MongoDB ObjectId.
	 * - Falls back to slug-based lookup if not found.
	 *
	 * Failure mode:
	 * - Throws NOT_FOUND if no matching article exists.
	 */
	async getArticle(identifier) {
		// Attempt lookup by document ID
		let article = await Article.findById(identifier).populate('author', 'username email bio');

		// Fallback lookup by slug if ID resolution fails
		if (!article) {
			article = await Article.findOne({ slug: identifier }).populate(
				'author',
				'username email bio',
			);
		}

		if (!article) {
			throw ApiError.notFound('Article not found');
		}

		return article;
	}

	/**
	 * Updates an existing article.
	 *
	 * Authorization:
	 * - Only the original author may update the article.
	 *
	 * Contract:
	 * - Accepts partial updates for title or content.
	 * - Persists changes and returns updated article.
	 *
	 * Failure modes:
	 * - NOT_FOUND if article does not exist.
	 * - FORBIDDEN if user is not the article author.
	 */
	async updateArticle(articleId, userId, updates) {
		const article = await Article.findById(articleId);

		if (!article) {
			throw ApiError.notFound('Article not found');
		}

		// Enforce author ownership before allowing mutation
		if (article.author.toString() !== userId.toString()) {
			throw ApiError.forbidden('You can only update your own articles');
		}

		// Apply permitted updates
		if (updates.title) article.title = updates.title;
		if (updates.content) article.content = updates.content;

		await article.save();
		await article.populate('author', 'username email bio');

		return article;
	}

	/**
	 * Deletes an article.
	 *
	 * Authorization:
	 * - Only the original author may delete the article.
	 *
	 * Failure modes:
	 * - NOT_FOUND if article does not exist.
	 * - FORBIDDEN if user is not the article author.
	 */
	async deleteArticle(articleId, userId) {
		const article = await Article.findById(articleId);

		if (!article) {
			throw ApiError.notFound('Article not found');
		}

		// Enforce author ownership before deletion
		if (article.author.toString() !== userId.toString()) {
			throw ApiError.forbidden('You can only delete your own articles');
		}

		await article.deleteOne();

		return { message: 'Article deleted successfully' };
	}

	/**
	 * Retrieves all articles authored by a specific user.
	 *
	 * Contract:
	 * - Articles are sorted by creation date (newest first).
	 * - Returns populated author details for each article.
	 */
	async getArticlesByAuthor(authorId) {
		const articles = await Article.find({ author: authorId })
			.populate('author', 'username email bio')
			.sort({ createdAt: -1 });

		return articles;
	}
}

export default new ArticleService();

