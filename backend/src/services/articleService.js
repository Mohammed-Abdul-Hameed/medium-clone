import Article from '../models/Article.js';
import { ApiError } from '../utils/ApiError.js';

class ArticleService {
  /**
   * Create a new article
   */
  async createArticle({ title, content, authorId }) {
    const article = await Article.create({
      title,
      content,
      author: authorId,
    });

    // Populate author details
    await article.populate('author', 'username email bio');

    return article;
  }

  /**
   * Get all articles (feed)
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
   * Get single article by ID or slug
   */
  async getArticle(identifier) {
    // Try to find by ID first, then by slug
    let article = await Article.findById(identifier).populate('author', 'username email bio');

    if (!article) {
      article = await Article.findOne({ slug: identifier }).populate('author', 'username email bio');
    }

    if (!article) {
      throw ApiError.notFound('Article not found');
    }

    return article;
  }

  /**
   * Update article
   */
  async updateArticle(articleId, userId, updates) {
    const article = await Article.findById(articleId);

    if (!article) {
      throw ApiError.notFound('Article not found');
    }

    // Check if user is the author
    if (article.author.toString() !== userId.toString()) {
      throw ApiError.forbidden('You can only update your own articles');
    }

    // Update fields
    if (updates.title) article.title = updates.title;
    if (updates.content) article.content = updates.content;

    await article.save();
    await article.populate('author', 'username email bio');

    return article;
  }

  /**
   * Delete article
   */
  async deleteArticle(articleId, userId) {
    const article = await Article.findById(articleId);

    if (!article) {
      throw ApiError.notFound('Article not found');
    }

    // Check if user is the author
    if (article.author.toString() !== userId.toString()) {
      throw ApiError.forbidden('You can only delete your own articles');
    }

    await article.deleteOne();

    return { message: 'Article deleted successfully' };
  }

  /**
   * Get articles by author
   */
  async getArticlesByAuthor(authorId) {
    const articles = await Article.find({ author: authorId })
      .populate('author', 'username email bio')
      .sort({ createdAt: -1 });

    return articles;
  }
}

export default new ArticleService();
