import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';

export interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }
  try {
    const payload = verifyToken(token);
    req.user = { userId: payload.userId, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
