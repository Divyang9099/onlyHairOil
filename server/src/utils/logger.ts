import pino from 'pino';
import env from '../config/env';

const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  base: { service: 'onlyhair-api', env: env.NODE_ENV },
  timestamp: pino.stdTimeFunctions.isoTime,
  // JSON in production, pretty-print in dev
  transport:
    env.NODE_ENV !== 'production'
      ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname,service,env',
        },
      }
      : undefined,
  // Redact sensitive fields from logs
  redact: {
    paths: [
      'req.headers.authorization',
      'req.body.password',
      'req.body.otp',
      'req.body.cardNumber',
    ],
    censor: '[REDACTED]',
  },
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
});

export default logger;
