import app from './app';
import connectDB from './config/db';
import redis from './config/redis';
import env from './config/env';
import logger from './utils/logger';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start HTTP server
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running in ${env.NODE_ENV} mode on http://localhost:${env.PORT}`);
      logger.info(`📋 Health check: http://localhost:${env.PORT}/health`);
    });

    // ─── Graceful Shutdown ───────────────────────────────────────────────────
    const gracefulShutdown = async (signal: string) => {
      logger.warn(`${signal} received. Starting graceful shutdown...`);
      server.close(async () => {
        logger.info('HTTP server closed');
        await redis.quit();
        logger.info('Redis connection closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // ─── Unhandled Rejections ────────────────────────────────────────────────
    process.on('unhandledRejection', (err: Error) => {
      logger.error(err, 'UNHANDLED REJECTION');
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (err: Error) => {
      logger.error(err, 'UNCAUGHT EXCEPTION');
      process.exit(1);
    });
  } catch (error) {
    logger.error(error as Error, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
