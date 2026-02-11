import { AppError } from '../../utils/error.utils';
import { EventRepository } from '../interfaces/event.repository';
import { CreateEventDTO } from '../dto/event/create-event.dto';
import { UpdateEventDTO } from '../dto/event/update-event.dto';
import { CalendarRepository } from '../interfaces/calendar.repository';

export class EventService {
  constructor(
    private repo: EventRepository,
    private calendarRepo: CalendarRepository,
  ) {}

  async getAll(calendarId: string, userId: string) {
    const calendar = await this.calendarRepo.findById(calendarId, userId);
    if (!calendar) throw new AppError(404, 'Calendar not found or unauthorized');
    
    return this.repo.findAllByCalendar(calendarId);
  }

  async getOne(id: string, userId: string) {
    const event = await this.repo.findById(id);
    if (!event) throw new AppError(404, 'Event not found');

    // Validate access to the calendar this event belongs to
    const calendar = await this.calendarRepo.findById(event.calendarId, userId);
    if (!calendar) throw new AppError(403, 'Forbidden: You do not have access to this event\'s calendar');

    return event;
  }

  async create(userId: string, data: CreateEventDTO) {
    // Validate if user has access to the target calendar
    const calendar = await this.calendarRepo.findById(data.calendarId, userId);
    if (!calendar) throw new AppError(404, 'Calendar not found or unauthorized');

    return this.repo.create({ ...data, creatorId: userId });
  }

  async update(id: string, userId: string, data: UpdateEventDTO) {
    const event = await this.repo.findById(id);
    if (!event) throw new AppError(404, 'Event not found');
    
    // Validate if user has write access (only creator for now)
    if (event.creatorId !== userId) {
      throw new AppError(403, 'Forbidden: Only the creator can update this event');
    }

    const updated = await this.repo.update(id, data);
    if (!updated) throw new AppError(404, 'Event not found during update');
    return updated;
  }

  async remove(id: string, userId: string) {
    const event = await this.repo.findById(id);
    if (!event) throw new AppError(404, 'Event not found');
    
    // Validate permission
    if (event.creatorId !== userId) {
      throw new AppError(403, 'Forbidden: Only the creator can delete this event');
    }

    const deleted = await this.repo.remove(id);
    if (!deleted) throw new AppError(500, 'Failed to delete event');
    return { message: 'Event deleted' };
  }
}
