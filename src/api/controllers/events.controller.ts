import { Response, NextFunction } from 'express';
import { EventService } from '../../core/services/event.service';
import { CreateEventDTO } from '../../core/dto/event/create-event.dto';
import { UpdateEventDTO } from '../../core/dto/event/update-event.dto';
import { AuthRequest } from '../middleware/auth.middleware.types';

export class EventsController {
  constructor(private service: EventService) {}

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { calendarId } = req.query as { calendarId: string };
      if (!calendarId) {
        res.status(400).json({ success: false, message: 'calendarId query parameter is required' });
        return;
      }
      const events = await this.service.getAll(calendarId);
      res.json({ success: true, data: events });
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const event = await this.service.getOne(id);
      res.json({ success: true, data: event });
    } catch (err) {
      next(err);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const body = req.body as CreateEventDTO;
      const event = await this.service.create(req.user.id, body);
      res.status(201).json({ success: true, data: event });
    } catch (err) {
      next(err);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const body = req.body as UpdateEventDTO;
      const event = await this.service.update(id, req.user.id, body);
      res.json({ success: true, data: event });
    } catch (err) {
      next(err);
    }
  }

  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params as { id: string };
      const result = await this.service.remove(id, req.user.id);
      res.json({ success: true, message: result.message });
    } catch (err) {
      next(err);
    }
  }
}
