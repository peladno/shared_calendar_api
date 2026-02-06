import { Router, RequestHandler } from 'express';
import { CalendarsController } from '../controllers/calendars.controller';
import { CalendarService } from '../../core/services/calendar.service';
import { PrismaCalendarRepository } from '../../infrastructure/repositories/calendar.prisma.repository';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import {
  createCalendarSchema,
  updateCalendarSchema,
} from '../../validators/calendar.validators';

const router = Router();
const repo = new PrismaCalendarRepository();
const service = new CalendarService(repo);
const controller = new CalendarsController(service);

router.use(authMiddleware as RequestHandler);

router.get('/', controller.getAll.bind(controller) as RequestHandler);
router.post(
  '/',
  validateBody(createCalendarSchema),
  controller.create.bind(controller) as RequestHandler,
);
router.get('/:id', controller.getOne.bind(controller) as RequestHandler);
router.put(
  '/:id',
  validateBody(updateCalendarSchema),
  controller.update.bind(controller) as RequestHandler,
);
router.delete('/:id', controller.remove.bind(controller) as RequestHandler);

export default router;
