import redis from '../config/redis';
import logger from './logger';

/**
 * Store OTP in Redis with an expiry time
 * @param mobile Mobile number (key)
 * @param otp The generated OTP
 * @param expiry Expiry time in seconds (default 5 minutes)
 */
export const storeOTP = async (
  mobile: string,
  otp: string,
  expiry: number = 300,
): Promise<void> => {
  try {
    const key = `otp:${mobile}`;
    await redis.set(key, otp, 'EX', expiry);
    logger.debug(`OTP stored for ${mobile}`);
  } catch (error) {
    logger.error(error, `Failed to store OTP for ${mobile}`);
    throw error;
  }
};

/**
 * Verify OTP from Redis
 * @param mobile Mobile number
 * @param otp The OTP to verify
 * @returns boolean indication of validity
 */
export const verifyOTP = async (mobile: string, otp: string): Promise<boolean> => {
  try {
    const key = `otp:${mobile}`;
    const storedOtp = await redis.get(key);

    if (storedOtp && storedOtp === otp) {
      await redis.del(key); // Clear OTP after successful verification
      return true;
    }
    return false;
  } catch (error) {
    logger.error(error, `Failed to verify OTP for ${mobile}`);
    return false;
  }
};

/**
 * Blacklist a JWT token (e.g., on logout)
 * @param token The token string
 * @param expiry Expiry time in seconds (matching token life)
 */
export const blacklistToken = async (token: string, expiry: number): Promise<void> => {
  try {
    const key = `blacklist:${token}`;
    await redis.set(key, 'true', 'EX', expiry);
    logger.debug(`Token blacklisted`);
  } catch (error) {
    logger.error(error, 'Failed to blacklist token');
  }
};

/**
 * Check if a token is blacklisted
 * @param token The token string
 * @returns boolean
 */
export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  try {
    const key = `blacklist:${token}`;
    const blacklisted = await redis.get(key);
    return blacklisted === 'true';
  } catch (error) {
    logger.error(error, 'Failed to check token blacklist');
    return false;
  }
};

/**
 * Generate a rate limit key based on various factors
 * @param prefix e.g., 'login' or 'otp'
 * @param identifier e.g., IP address or mobile number
 * @returns formatted string key
 */
export const rateLimitKey = (prefix: string, identifier: string): string => {
  return `ratelimit:${prefix}:${identifier}`;
};
