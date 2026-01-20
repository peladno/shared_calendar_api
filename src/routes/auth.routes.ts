import { Router } from 'express';
import { validateBody } from '../middleware/validate.middleware';
import { AuthController } from '../controllers/auth.controllers';
//import { authMiddleware } from '../middleware/auth.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validators';

const router = Router();
const controller = new AuthController();

router.post('/register', validateBody(registerSchema), (req, res, next) =>
  controller.register(req, res, next),
);

router.post('/login', validateBody(loginSchema), (req, res, next) =>
  controller.login(req, res, next),
);

// router.get('/me', authMiddleware, (req, res, next) =>
//   controller.me(req, res, next),
// );

export default router;
