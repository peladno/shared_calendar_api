import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AuthService } from '../services/auth.services';
import logger from '../utils/logger.utils';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    const { email, username, password } = req.body;
    logger.info('User registration attempt', { email, username });
    const result = await authService.register(email, username, password);
    logger.info('User registered successfully', { email, username });
    res.status(201).json(result);
  }

  async login(req: Request, res: Response) {
    const { email } = req.body;
    logger.info('User login attempt', { email });
    const result = await authService.login(email, req.body.password);
    logger.info('User logged in successfully', { email });
    res.json(result);
  }

  async me(req: AuthRequest, res: Response) {
    const userId = req.user!.userId;
    logger.debug('User profile requested', { userId });
    const user = await authService.me(userId);
    res.json(user);
  }
}
