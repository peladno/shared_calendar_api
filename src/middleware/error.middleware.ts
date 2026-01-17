import type { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger.utils';

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
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
