import articleService from '../services/articleService.js';

class ArticleController {
  /**
   * @route   POST /api/articles
   * @desc    Create a new article
   * @access  Private
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
      next(error);
    }
  }

  /**
   * @route   GET /api/articles
   * @desc    Get all articles (feed)
   * @access  Public
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
   * @route   GET /api/articles/:id
   * @desc    Get single article
   * @access  Public
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
   * @route   PUT /api/articles/:id
   * @desc    Update article
   * @access  Private (Author only)
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
   * @route   DELETE /api/articles/:id
   * @desc    Delete article
   * @access  Private (Author only)
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
