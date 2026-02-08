import { Router, RequestHandler } from 'express';
import { EventsController } from '../controllers/events.controller';
import { EventService } from '../../core/services/event.service';
import { PrismaEventRepository } from '../../infrastructure/repositories/event.prisma.repository';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import {
  createEventSchema,
  updateEventSchema,
} from '../../validators/event.validators';

const router = Router();
const repo = new PrismaEventRepository();
const service = new EventService(repo);
const controller = new EventsController(service);

router.use(authMiddleware as RequestHandler);

// GET /api/events?calendarId=...
router.get('/', controller.getAll.bind(controller) as RequestHandler);

// POST /api/events
router.post(
  '/',
  validateBody(createEventSchema),
  controller.create.bind(controller) as RequestHandler,
);

// GET /api/events/:id
router.get('/:id', controller.getOne.bind(controller) as RequestHandler);

// PUT /api/events/:id
router.put(
  '/:id',
  validateBody(updateEventSchema),
  controller.update.bind(controller) as RequestHandler,
);

// DELETE /api/events/:id
router.delete('/:id', controller.remove.bind(controller) as RequestHandler);

export default router;
