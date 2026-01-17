import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AuthService } from '../services/auth.services';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    const { email, username, password } = req.body;
    const result = await authService.register(email, username, password);
    res.status(201).json(result);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  }

  async me(req: AuthRequest, res: Response) {
    const userId = req.user!.userId;
    const user = await authService.me(userId);
    res.json(user);
  }
}
