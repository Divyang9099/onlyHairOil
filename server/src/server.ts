import './config/dns-override';
import { initSentry } from './config/sentry';

// Initialize Sentry before everything else (if DSN is configured)
initSentry();

import app from './app';
import connectDB, { closeDB } from './config/db';
import redis from './config/redis';
import env from './config/env';
import logger from './utils/logger';

const startServer = async () => {
  logger.info({ port: env.PORT, env: env.NODE_ENV }, 'Starting server...');

  try {
    await connectDB();

    const server = app.listen(env.PORT, () => {
      logger.info(
        { url: `http://localhost:${env.PORT}`, health: `http://localhost:${env.PORT}/health` },
        '🚀 Server running',
      );
    });

    // ── Graceful Shutdown ──────────────────────────────────────────────────────
    const gracefulShutdown = async (signal: string) => {
      logger.warn({ signal }, 'Shutdown signal received, closing gracefully...');
      server.close(async () => {
        logger.info('HTTP server closed');
        await closeDB();
        await redis.quit();
        logger.info('All connections closed. Exiting.');
        process.exit(0);
      });

      // Force kill after 10s
      setTimeout(() => {
        logger.error('Graceful shutdown timed out. Forcing exit.');
        process.exit(1);
      }, 10_000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason: unknown) => {
      logger.error({ reason }, 'UNHANDLED REJECTION');
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (err: Error) => {
      logger.error({ err }, 'UNCAUGHT EXCEPTION');
      process.exit(1);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();
