import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import redis from '../config/redis';
import logger from '../utils/logger';

const router = Router();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
    const checks = {
        mongodb: 'unknown',
        redis: 'unknown',
    };

    // MongoDB check
    try {
        const dbState = mongoose.connection.readyState;
        checks.mongodb = dbState === 1 ? 'healthy' : 'unhealthy';
    } catch {
        checks.mongodb = 'unhealthy';
    }

    // Redis check
    try {
        const pong = await redis.ping();
        checks.redis = pong === 'PONG' ? 'healthy' : 'unhealthy';
    } catch {
        checks.redis = 'unhealthy';
    }

    const allHealthy = Object.values(checks).every((v) => v === 'healthy');
    const statusCode = allHealthy ? 200 : 503;

    if (!allHealthy) {
        logger.warn({ checks }, 'Health check reported degraded state');
    }

    res.status(statusCode).json({
        success: allHealthy,
        service: 'onlyhair-api',
        version: process.env.npm_package_version ?? '1.0.0',
        environment: process.env.NODE_ENV ?? 'development',
        uptime: `${Math.floor(process.uptime())}s`,
        timestamp: new Date().toISOString(),
        checks,
    });
});

export default router;
