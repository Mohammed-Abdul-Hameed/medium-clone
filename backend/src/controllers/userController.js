import User from '../models/User.js';
import articleService from '../services/articleService.js';
import { ApiError } from '../utils/ApiError.js';

class UserController {
  /**
   * @route   GET /api/users/:username
   * @desc    Get user profile with their articles
   * @access  Public
   */
  async getUserProfile(req, res, next) {
    try {
      const { username } = req.params;

      const user = await User.findOne({ username });

      if (!user) {
        throw ApiError.notFound('User not found');
      }

      // Get user's articles
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
