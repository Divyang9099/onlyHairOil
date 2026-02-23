import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('5000'),

  // Database
  MONGO_URI: z.string().min(1, { message: 'MONGO_URI is required' }),
  REDIS_URL: z.string().min(1, { message: 'REDIS_URL is required' }),

  // Auth (RSA Keys)
  JWT_PRIVATE_KEY: z.string().min(1, { message: 'JWT_PRIVATE_KEY is required' }),
  JWT_PUBLIC_KEY: z.string().min(1, { message: 'JWT_PUBLIC_KEY is required' }),

  // AWS
  AWS_ACCESS_KEY: z.string().min(1, { message: 'AWS_ACCESS_KEY is required' }),
  AWS_SECRET_KEY: z.string().min(1, { message: 'AWS_SECRET_KEY is required' }),
  AWS_REGION: z.string().default('ap-south-1'),
  AWS_S3_BUCKET: z.string().optional(),

  // Payments
  RAZORPAY_KEY_ID: z.string().min(1, { message: 'RAZORPAY_KEY_ID is required' }),
  RAZORPAY_SECRET: z.string().min(1, { message: 'RAZORPAY_SECRET is required' }),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('900000'),
  RATE_LIMIT_MAX: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('100'),

  // Client
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
});

// Validate process.env
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:');
  console.error(JSON.stringify(_env.error.format(), null, 2));
  process.exit(1);
}

const env = _env.data;

export default env;
export type EnvConfig = z.infer<typeof envSchema>;
