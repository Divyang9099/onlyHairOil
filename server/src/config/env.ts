import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),

  // Database
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/onlyhair',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // AWS S3
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || 'onlyhair-assets',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),

  // CORS
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

  // Email
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
};

export default env;
