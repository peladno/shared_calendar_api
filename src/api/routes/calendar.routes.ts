import { Router, RequestHandler } from 'express';
import { CalendarsController } from '../controllers/calendars.controller';
import { CalendarService } from '../../core/services/calendar.service';
import { PrismaCalendarRepository } from '../../infrastructure/repositories/calendar.prisma.repository';
import { PrismaAuthRepository } from '../../infrastructure/repositories/auth.prisma.repository';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';
import {
  createCalendarSchema,
  updateCalendarSchema,
  shareCalendarSchema,
  updateMemberRoleSchema,
} from '../../validators/calendar.validators';

const router = Router();
const repo = new PrismaCalendarRepository();
const authRepo = new PrismaAuthRepository();
const service = new CalendarService(repo, authRepo);
const controller = new CalendarsController(service);

router.use(authMiddleware as RequestHandler);

// GET /api/calendars
router.get('/', controller.getAll.bind(controller) as RequestHandler);
// POST /api/calendars
router.post(
  '/',
  validateBody(createCalendarSchema),
  controller.create.bind(controller) as RequestHandler,
);
// GET /api/calendars/:id
router.get('/:id', controller.getOne.bind(controller) as RequestHandler);
// PUT /api/calendars/:id
router.put(
  '/:id',
  validateBody(updateCalendarSchema),
  controller.update.bind(controller) as RequestHandler,
);
// DELETE /api/calendars/:id
router.delete('/:id', controller.remove.bind(controller) as RequestHandler);

// Sharing members
// POST /api/calendars/:id/share
router.post(
  '/:id/share',
  validateBody(shareCalendarSchema),
  controller.share.bind(controller) as RequestHandler,
);
// PUT /api/calendars/:id/members/:userId
router.put(
  '/:id/members/:userId',
  validateBody(updateMemberRoleSchema),
  controller.updateMemberRole.bind(controller) as RequestHandler,
);
// DELETE /api/calendars/:id/members/:userId
router.delete(
  '/:id/members/:userId',
  controller.removeMember.bind(controller) as RequestHandler,
);

export default router;
