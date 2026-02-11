import { UpdateCalendarDTO } from './../../core/dto/calendar/update-calendar.dto';
import { Response, NextFunction } from 'express';
import { CalendarService } from '../../core/services/calendar.service';
import { CreateCalendarDTO } from '../../core/dto/calendar/create-calendar.dto';
import { AuthRequest } from '../middleware/auth.middleware.types';

export class CalendarsController {
  constructor(private service: CalendarService) {}

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const calendars = await this.service.getAll(req.user.id);
      res.json({ success: true, data: calendars });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const calendar = await this.service.getOne(id, req.user.id);
      res.json({ success: true, data: calendar });
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const body = req.body as CreateCalendarDTO;
      const calendar = await this.service.create(req.user.id, body);
      res.status(201).json({ success: true, data: calendar });
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const body = req.body as UpdateCalendarDTO;
      await this.service.update(id, req.user.id, body);
      res.json({ success: true, message: 'Updated' });
    } catch (err) {
      next(err);
    }
  }

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      await this.service.remove(id, req.user.id);
      res.json({ success: true, message: 'Deleted' });
    } catch (err) {
      next(err);
    }
  }

  async share(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const { email } = req.body as { email: string };
      const member = await this.service.shareCalendar(id, req.user.id, email);
      res.json({ success: true, data: member });
    } catch (err) {
      next(err);
    }
  }

  async updateMemberRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id, userId } = req.params as { id: string; userId: string };
      const { role } = req.body as { role: string };
      await this.service.updateMemberRole(id, req.user.id, userId, role);
      res.json({ success: true, message: 'Member role updated' });
    } catch (err) {
      next(err);
    }
  }

  async removeMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id, userId } = req.params as { id: string; userId: string };
      await this.service.removeMember(id, req.user.id, userId);
      res.json({ success: true, message: 'Member removed' });
    } catch (err) {
      next(err);
    }
  }
}
