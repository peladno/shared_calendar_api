import { Response, NextFunction } from 'express';
import { CalendarsService } from '../services/calendar.services';
import { AuthRequest } from '../middleware/auth.middleware';
import logger from '../utils/logger.utils';
import { AppError } from '../utils/error.utils';

interface CalendarParams {
  id: string;
}

interface CreateCalendarBody {
  name: string;
  description?: string;
  color?: string;
  isShared?: boolean;
}

interface UpdateCalendarBody {
  name?: string;
  description?: string;
  color?: string;
  isShared?: boolean;
}

export class CalendarsController {
  private calendarsService: CalendarsService;

  constructor() {
    this.calendarsService = new CalendarsService();
  }
  async getAllCalendars(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.userId;
      logger.debug('Fetching calendars for user', { userId });

      const calendars = await this.calendarsService.getAllByUser(userId);

      logger.info('Calendars fetched successfully', {
        userId,
        count: calendars.length,
      });

      res.status(200).json({
        success: true,
        data: calendars,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOneCalendar(
    req: AuthRequest & { params: CalendarParams },
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user.userId;
      const calendarId = req.params.id; // ✅ Ahora TypeScript sabe que es string

      logger.debug('Fetching calendar', { userId, calendarId });

      const calendar = await this.calendarsService.getById(calendarId, userId);

      if (!calendar) {
        throw new AppError(404, 'Calendar not found');
      }

      logger.info('Calendar fetched successfully', { userId, calendarId });
      res.status(200).json({
        success: true,
        data: calendar,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new calendar
   */
  async createCalendar(
    req: AuthRequest & { body: CreateCalendarBody },
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { name, description, color } = req.body;

      if (!name || name.trim().length === 0) {
        throw new AppError(400, 'Calendar name is required');
      }

      logger.info('Creating calendar', { userId, name });

      const calendar = await this.calendarsService.create(userId, {
        name: name.trim(),
        description,
        color,
      });

      res.status(201).json({
        success: true,
        data: calendar,
        message: 'Calendar created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCalendar(
    req: AuthRequest & {
      params: CalendarParams;
      body: UpdateCalendarBody;
    },

    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const calendarId = req.params.id;
      const data = req.body;

      if (Object.keys(data).length === 0) {
        throw new AppError(400, 'No data provided for update');
      }

      logger.info('Updating calendar', { userId, calendarId });

      const result = await this.calendarsService.update(
        calendarId,
        userId,
        data,
      );

      if (result.count === 0) {
        throw new AppError(
          404,
          'Calendar not found or you do not have permission',
        );
      }

      logger.info('Calendar updated successfully', { userId, calendarId });
      res.status(200).json({
        success: true,
        message: 'Calendar updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async removeCalendar(
    req: AuthRequest & { params: CalendarParams }, // ✅ Tipado con params
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const calendarId = req.params.id; // ✅ string

      logger.info('Deleting calendar', { userId, calendarId });

      const result = await this.calendarsService.remove(calendarId, userId);

      if (result.count === 0) {
        throw new AppError(
          404,
          'Calendar not found or you do not have permission',
        );
      }

      logger.info('Calendar deleted successfully', { userId, calendarId });
      res.status(200).json({
        success: true,
        message: 'Calendar deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
