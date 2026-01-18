import cors from 'cors';
import express from 'express';
import { config } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import articleRoutes from './routes/articleRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Middleware
// Middleware
app.use(cors({
  origin: config.client.url,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/users', userRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
