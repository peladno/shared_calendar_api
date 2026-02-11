import { Router, RequestHandler } from 'express';
import { EventsController } from '../controllers/events.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import { createEventSchema, updateEventSchema } from '../../validators/event.validators';
import { PrismaEventRepository } from '../../infrastructure/repositories/event.prisma.repository';
import { PrismaCalendarRepository } from '../../infrastructure/repositories/calendar.prisma.repository';
import { EventService } from '../../core/services/event.service';


const router = Router();
const repo = new PrismaEventRepository();
const calendarRepo = new PrismaCalendarRepository();
const service = new EventService(repo, calendarRepo);
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
