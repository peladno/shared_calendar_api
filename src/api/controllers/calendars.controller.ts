import { UpdateCalendarDTO } from './../../core/dto/calendar/update-calendar.dto';
import { Response, NextFunction } from 'express';
import { CalendarService } from '../../core/services/calendar.service';
import { CreateCalendarDTO } from '../../core/dto/calendar/create-calendar.dto';
import { AuthRequest } from '../middleware/auth.middleware.types';

export class CalendarsController {
  constructor(private service: CalendarService) {}

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const calendars = await this.service.getAll(req.user.userId);
      res.json({ success: true, data: calendars });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const calendar = await this.service.getOne(id, req.user.userId);
      res.json({ success: true, data: calendar });
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const body = req.body as CreateCalendarDTO;
      const calendar = await this.service.create(req.user.userId, body);
      res.status(201).json({ success: true, data: calendar });
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const body = req.body as UpdateCalendarDTO;
      await this.service.update(id, req.user.userId, body);
      res.json({ success: true, message: 'Updated' });
    } catch (err) {
      next(err);
    }
  }

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      await this.service.remove(id, req.user.userId);
      res.json({ success: true, message: 'Deleted' });
    } catch (err) {
      next(err);
    }
  }
}
