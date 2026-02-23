import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import logger from '../utils/logger';

/**
 * Attaches a unique X-Request-Id to every request and
 * logs method, path, status code and response time.
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    const reqId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
    req.headers['x-request-id'] = reqId;
    res.setHeader('X-Request-Id', reqId);

    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = logger.child({ reqId });

        const payload = {
            method: req.method,
            path: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent'),
        };

        if (res.statusCode >= 500) {
            log.error(payload, 'request completed with server error');
        } else if (res.statusCode >= 400) {
            log.warn(payload, 'request completed with client error');
        } else {
            log.info(payload, 'request completed');
        }
    });

    next();
};
