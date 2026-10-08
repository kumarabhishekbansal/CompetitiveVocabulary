import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';

const startServer = async () => {
  // Initialize Database connection (non-blocking)
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`====================================================`);
    console.log(`🚀 Competitive Vocabulary API Server running`);
    console.log(`📡 Environment: ${config.nodeEnv}`);
    console.log(`🌐 Port: ${config.port}`);
    console.log(`🩺 Health check: http://localhost:${config.port}/api/v1/health`);
    console.log(`====================================================`);
  });

  // Handle graceful shutdown
  const shutdown = () => {
    console.log('\n[Server] Received termination signal. Closing HTTP server...');
    server.close(() => {
      console.log('[Server] HTTP server closed gracefully.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer().catch((err) => {
  console.error('[Server Fatal] Failed to start application:', err);
  process.exit(1);
});
