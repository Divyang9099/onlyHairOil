import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';
import env from './config/env';
import { globalRateLimiter, notFound } from './middleware/rateLimiter';
import errorHandler from './middleware/errorHandler';
import logger from './utils/logger';

// Route imports (add as you build them)
// import authRoutes from './routes/auth.routes';

const app: Application = express();

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(hpp());
app.use(globalRateLimiter);

// ─── Logging ───────────────────────────────────────────────────────────────────
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: { write: (msg) => logger.info(msg.trim()) },
    }),
  );
}

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
