import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { config } from './src/config/env.js';

// Connect to MongoDB
await connectDB();

// Start server
const server = app.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`);
  console.log(`📍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 API: http://localhost:${config.port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});
