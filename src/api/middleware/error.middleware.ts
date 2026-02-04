import type { Request, Response, NextFunction } from 'express';
import logger from '../../infrastructure/logger/logger.utils';
import { AppError } from '../../utils/error.utils';

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  logger.error('Error occurred', {
    status,
    message,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  res.status(status).json({ message });
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    logger.warn(err.message, {
      status: err.statusCode,
    });

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  logger.error('Unexpected error', {
    message: err.message,
    stack: err.stack,
  });

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}
