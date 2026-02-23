import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import crypto from 'crypto';
import env from './config/env';
import { globalRateLimiter, notFound } from './middleware/rateLimiter';
import { requestLogger } from './middleware/requestLogger';
import errorHandler from './middleware/errorHandler';
import healthRouter from './routes/health.routes';

// ─── Route imports (add as you build them) ────────────────────────────────────
// import authRoutes from './routes/auth.routes';

const app: Application = express();

// ── 1. helmet() ───────────────────────────────────────────────────────────────
app.use(helmet());

// ── 2. cors() ─────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
    exposedHeaders: ['X-Request-Id'],
  }),
);

// ── 3. hpp() ──────────────────────────────────────────────────────────────────
app.use(hpp());

// ── 4. rateLimit() ────────────────────────────────────────────────────────────
app.use(globalRateLimiter);

// ── 5. express.json() ─────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── 6. requestId middleware ───────────────────────────────────────────────────
app.use((req, res, next) => {
  const reqId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  req.headers['x-request-id'] = reqId;
  res.setHeader('X-Request-Id', reqId);
  next();
});

// ── 7. Structured request logger middleware ───────────────────────────────────
app.use(requestLogger);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/health', healthRouter);
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/products', productRoutes);
// app.use('/api/v1/orders', orderRoutes);

// ── 8. 404 + Error Handler (last) ─────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
