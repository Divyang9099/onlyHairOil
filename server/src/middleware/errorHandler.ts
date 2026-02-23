import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/response';
import logger from '../utils/logger';

const handleCastErrorDB = (err: { path: string; value: unknown }) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateFieldsDB = (err: { keyValue: Record<string, unknown> }) => {
  const value = Object.values(err.keyValue)[0];
  return new AppError(`Duplicate field value: "${value}". Please use another value.`, 400);
};

const handleValidationErrorDB = (err: { errors: Record<string, { message: string }> }) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Invalid input data. ${errors.join('. ')}`, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);
const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    logger.error(err);
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }

  // Production: handle specific errors
  let error = { ...err, message: err.message };

  if (err.name === 'CastError') error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors,
    });
  }

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // Unknown errors — don't leak details
  logger.error('UNHANDLED ERROR:', err);
  return res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again later.',
  });
};

export default errorHandler;
