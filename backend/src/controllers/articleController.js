import articleService from '../services/articleService.js';

/**
 * ArticleController
 *
 * Handles HTTP request/response translation for article resources.
 * Business logic is intentionally delegated to the service layer.
 * This controller is responsible only for:
 *  - Extracting request parameters
 *  - Enforcing request context (authenticated user)
 *  - Mapping service responses to HTTP responses
 *  - Forwarding errors to the centralized error handler
 */
class ArticleController {
	/**
	 * Creates a new article authored by the authenticated user.
	 *
	 * Trust boundary:
	 * - req.user is assumed to be populated by authentication middleware.
	 * - Validation of title/content is expected to occur upstream.
	 */
	async createArticle(req, res, next) {
		try {
			const { title, content } = req.body;
			const authorId = req.user._id;

			const article = await articleService.createArticle({
				title,
				content,
				authorId,
			});

			res.status(201).json({
				success: true,
				message: 'Article created successfully',
				data: { article },
			});
		} catch (error) {
			// Delegate error handling to global error middleware
			next(error);
		}
	}

	/**
	 * Returns a paginated feed of articles.
	 *
	 * Pagination contract:
	 * - limit: max number of records to return (default: 20)
	 * - skip: offset for pagination (default: 0)
	 */
	async getAllArticles(req, res, next) {
		try {
			const limit = parseInt(req.query.limit) || 20;
			const skip = parseInt(req.query.skip) || 0;

			const result = await articleService.getAllArticles({ limit, skip });

			res.status(200).json({
				success: true,
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Retrieves a single article by identifier.
	 * Public access - no authentication context required.
	 */
	async getArticle(req, res, next) {
		try {
			const { id } = req.params;

			const article = await articleService.getArticle(id);

			res.status(200).json({
				success: true,
				data: { article },
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Updates an existing article.
	 *
	 * Authorization contract:
	 * - req.user must be authenticated.
	 * - Service layer enforces author ownership.
	 *
	 * Partial updates are allowed; only provided fields are modified.
	 */
	async updateArticle(req, res, next) {
		try {
			const { id } = req.params;
			const userId = req.user._id;
			const updates = req.body;

			const article = await articleService.updateArticle(id, userId, updates);

			res.status(200).json({
				success: true,
				message: 'Article updated successfully',
				data: { article },
			});
		} catch (error) {
			next(error);
		}
	}

	/**
	 * Deletes an article.
	 *
	 * Authorization contract:
	 * - req.user must be authenticated.
	 * - Service layer enforces author ownership.
	 *
	 * A successful deletion returns only a confirmation message.
	 */
	async deleteArticle(req, res, next) {
		try {
			const { id } = req.params;
			const userId = req.user._id;

			const result = await articleService.deleteArticle(id, userId);

			res.status(200).json({
				success: true,
				message: result.message,
			});
		} catch (error) {
			next(error);
		}
	}
}

export default new ArticleController();
