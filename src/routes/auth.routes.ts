import { Router } from 'express';
import { validateBody } from '../middleware/validate.middleware';
import { AuthController } from '../controllers/auth.controllers';
import { authMiddleware } from '../middleware/auth.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validators';

const router = Router();
const controller = new AuthController();

router.post('/register', validateBody(registerSchema), (req, res) =>
  controller.register(req, res)
);
router.post('/login', validateBody(loginSchema), (req, res) =>
  controller.login(req, res)
);
router.get('/me', authMiddleware, (req, res) => controller.me(req, res));

export default router;
