import { Router } from 'express';

import { AuthController } from '../controllers/auth.controllers';
import { loginSchema, registerSchema } from '../../validators/auth.validators';
import { validateBody } from '../middleware/validate.middleware';
//import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new AuthController();

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
//router.get('/me', authMiddleware, controller.me.bind(controller));

export default router;
