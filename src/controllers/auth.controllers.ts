import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AuthService } from '../services/auth.services';
import logger from '../utils/logger.utils';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, username, password } = req.body;

      logger.info('User registration attempt', { email, username });

      const result = await this.authService.register(email, username, password);
      logger.info('User registered successfully', { email, username });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      logger.info('User login attempt', { email });

      const result = await this.authService.login(email, req.body.password);
      logger.info('User logged in successfully', { email });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async me(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      logger.debug('User profile requested', { userId });

      const user = await this.authService.me(userId);

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
