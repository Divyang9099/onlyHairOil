import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';
import crypto from 'crypto';
import env from './config/env';
import { globalRateLimiter, notFound } from './middleware/rateLimiter';
import errorHandler from './middleware/errorHandler';
import logger from './utils/logger';

const app: Application = express();

// 1. helmet()
app.use(helmet());

// 2. cors()
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
  }),
);

// 3. hpp()
app.use(hpp());

// 4. rateLimit()
app.use(globalRateLimiter);

// 5. express.json()
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. requestId middleware
app.use((req, res, next) => {
  const reqId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  req.headers['x-request-id'] = reqId; // Store it so morgan can access it easily
  res.setHeader('X-Request-Id', reqId);
  next();
});

// 7. logger middleware
morgan.token('id', (req) => (req.headers['x-request-id'] as string) || '-');

if (env.NODE_ENV === 'development') {
  app.use(morgan(':id :method :url :status :response-time ms - :res[content-length]'));
} else {
  app.use(
    morgan(
      ':id :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
      {
        stream: { write: (msg) => logger.info(msg.trim()) },
      },
    ),
  );
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'OnlyHair API is running',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/products', productRoutes);
// app.use('/api/v1/orders', orderRoutes);
// app.use('/api/v1/cart', cartRoutes);
// app.use('/api/v1/coupons', couponRoutes);

// ─── 404 + Error Handlers ─────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
