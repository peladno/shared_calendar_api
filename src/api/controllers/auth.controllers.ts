import { Response, NextFunction } from 'express';
import { PrismaAuthRepository } from '../../infrastructure/repositories/auth.prisma.repository';
import { AuthService } from '../../core/services/auth.service';
import { RegisterDTO } from '../../core/dto/auth/register.dto';
import { LoginDTO } from '../../core/dto/auth/login.dto';
import logger from '../../utils/logger.utils';
import { AuthResponseDTO } from '../../core/dto/auth/auth-response.dto';

export class AuthController {
  private service = new AuthService(new PrismaAuthRepository());

  async register(
    req: { body: RegisterDTO },
    res: Response,
    next: NextFunction,
  ) {
    try {
      logger.info('User registration attempt', { email: req.body.email });

      const result = await this.service.register(req.body);

      logger.info('User registered successfully', { email: req.body.email });

      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async login(req: { body: LoginDTO }, res: Response, next: NextFunction) {
    try {
      logger.info('User login attempt', { email: req.body.email });

      const result = await this.service.login(req.body);

      logger.info('User logged in successfully', { email: req.body.email });

      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async me(req: { body: AuthResponseDTO }, res: Response, next: NextFunction) {
    try {
      const userId = req.body.user.id;

      logger.debug('User profile requested', { userId });

      const user = await this.service.me(userId);

      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
}
