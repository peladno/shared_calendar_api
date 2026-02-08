import { Response, NextFunction } from 'express';
import { verifyToken } from '../../utils/jwt.utils';
import { AuthRequest } from './auth.middleware.types';
import { AppError } from '../../utils/error.utils';
import logger from '../../infrastructure/logger/logger.utils';

export function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError(401, 'Invalid token format');
    }

    const payload = verifyToken(token);

    req.user = {
      id: payload.id,
      email: payload.email,
    };

    logger.debug('Authenticated request', { id: payload.id });

    next();
  } catch (err) {
    logger.warn('Authentication failed', { error: err });
    next(new AppError(401, 'Invalid or expired token'));
  }
}
