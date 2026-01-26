import { UpdateCalendarDTO } from './../../core/dto/calendar/update-calendar.dto';
import { Response, NextFunction } from 'express';
import { CalendarService } from '../../core/services/calendar.service';
import { PrismaCalendarRepository } from '../../infrastructure/repositories/calendar.prisma.repository';
import { CreateCalendarDTO } from '../../core/dto/calendar/create-calendar.dto';
import { LoginDTO } from '../../core/dto/auth/login.dto';
import { AuthResponseDTO } from '../../core/dto/auth/auth-response.dto';

export class CalendarsController {
  private service = new CalendarService(new PrismaCalendarRepository());

  async getAll(
    req: { body: AuthResponseDTO },
    res: Response,
    next: NextFunction,
  ) {
    try {
      const calendars = await this.service.getAll(req.body.user.id);
      res.json({ success: true, data: calendars });
    } catch (err) {
      next(err);
    }
  }

  async getOne(
    req: { body: AuthResponseDTO } & { params: { id: string } },
    res: Response,
    next: NextFunction,
  ) {
    try {
      const calendar = await this.service.getOne(
        req.params.id,
        req.body.user.id,
      );
      res.json({ success: true, data: calendar });
    } catch (err) {
      next(err);
    }
  }

  async create(
    req: { body: AuthResponseDTO } & { body: CreateCalendarDTO },
    res: Response,
    next: NextFunction,
  ) {
    try {
      const calendar = await this.service.create(req.body.user.id, req.body);
      res.status(201).json({ success: true, data: calendar });
    } catch (err) {
      next(err);
    }
  }

  async update(
    req: { body: AuthResponseDTO } & {
      params: { id: string };
      body: UpdateCalendarDTO;
    },
    res: Response,
    next: NextFunction,
  ) {
    try {
      await this.service.update(req.params.id, req.body.user.id, req.body);
      res.json({ success: true, message: 'Updated' });
    } catch (err) {
      next(err);
    }
  }

  async remove(
    req: { body: AuthResponseDTO } & { params: { id: string } },
    res: Response,
    next: NextFunction,
  ) {
    try {
      await this.service.remove(req.params.id, req.body.user.id);
      res.json({ success: true, message: 'Deleted' });
    } catch (err) {
      next(err);
    }
  }
}
