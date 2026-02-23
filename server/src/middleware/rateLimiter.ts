import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import env from '../config/env';

export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
  },
});

export const notFound = (req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
