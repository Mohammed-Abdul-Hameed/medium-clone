import User from '../models/User.js';
import articleService from '../services/articleService.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * UserController
 *
 * Handles public user-facing profile retrieval.
 * Unlike other controllers, this currently accesses
 * the User model directly. In a stricter architecture,
 * this query would be delegated to a userService.
 */
class UserController {
	/**
	 * Retrieves a user's public profile along with their articles.
	 *
	 * Contract:
	 * - Username is supplied as a path parameter.
	 * - Returns basic user profile data and authored articles.
	 *
	 * Failure modes:
	 * - Throws NOT_FOUND if no user exists for the given username.
	 *
	 * Note:
	 * - Article retrieval is delegated to the article service.
	 * - User lookup is currently performed inline; this is an
	 *   intentional deviation from the service-layer pattern.
	 */
	async getUserProfile(req, res, next) {
		try {
			const { username } = req.params;

			const user = await User.findOne({ username });

			if (!user) {
				throw ApiError.notFound('User not found');
			}

			// Fetch all articles authored by the resolved user
			const articles = await articleService.getArticlesByAuthor(user._id);

			res.status(200).json({
				success: true,
				data: {
					user,
					articles,
				},
			});
		} catch (error) {
			next(error);
		}
	}
}

export default new UserController();
