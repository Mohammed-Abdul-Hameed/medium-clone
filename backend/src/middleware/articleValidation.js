import { z } from 'zod';
import { ApiError } from '../utils/ApiError.js';

// Validation schemas
export const createArticleSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters'),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters'),
});

export const updateArticleSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters')
    .optional(),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters')
    .optional(),
}).refine(
  (data) => data.title || data.content,
  {
    message: 'At least one field (title or content) must be provided',
  }
);

// Middleware to validate request body
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        throw ApiError.badRequest('Validation failed', errors);
      }
      next(error);
    }
  };
};
