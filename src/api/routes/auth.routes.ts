import { Router, RequestHandler } from 'express';

import { AuthController } from '../controllers/auth.controller';
import { loginSchema, registerSchema } from '../../validators/auth.validators';
import { validateBody } from '../middleware/validate.middleware';
import { PrismaAuthRepository } from '../../infrastructure/repositories/auth.prisma.repository';
import { AuthService } from '../../core/services/auth.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const repo = new PrismaAuthRepository();
const service = new AuthService(repo);
const controller = new AuthController(service);

router.post(
  '/register',
  validateBody(registerSchema),
  controller.register.bind(controller),
);
router.post(
  '/login',
  validateBody(loginSchema),
  controller.login.bind(controller),
);
router.get(
  '/me',
  authMiddleware as unknown as RequestHandler,
  controller.me.bind(controller) as unknown as RequestHandler,
);

export default router;
