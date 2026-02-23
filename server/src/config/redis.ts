import IORedis from 'ioredis';
import env from './env';
import logger from '../utils/logger';

const redis = new IORedis(env.REDIS_URL, {
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => logger.info('Redis connected'));
redis.on('error', (err) => logger.error(err, 'Redis error'));
redis.on('reconnecting', () => logger.warn('Redis reconnecting...'));

export default redis;
