import { AppError } from '../../utils/error.utils';
import { EventRepository } from '../interfaces/event.repository';
import { CreateEventDTO } from '../dto/event/create-event.dto';
import { UpdateEventDTO } from '../dto/event/update-event.dto';

export class EventService {
  constructor(private repo: EventRepository) {}

  async getAll(calendarId: string) {
    // TODO: Validate if user has access to this calendar (requires CalendarRepository or similar check)
    return this.repo.findAllByCalendar(calendarId);
  }

  async getOne(id: string) {
     // TODO: Validate access
    const event = await this.repo.findById(id);
    if (!event) throw new AppError(404, 'Event not found');
    return event;
  }

  async create(userId: string, data: CreateEventDTO) {
    // TODO: Validate if user has write access to data.calendarId
    return this.repo.create({ ...data, creatorId: userId });
  }

  async update(id: string, userId: string, data: UpdateEventDTO) {
    const event = await this.repo.findById(id);
    if (!event) throw new AppError(404, 'Event not found');
    
    // TODO: Validate if user has write access (creator or calendar admin/editor)
    // For now, allow creator or any auth user (simplified)
    // Strict check: if (event.creatorId !== userId) throw new AppError(403, 'Forbidden');

    const updated = await this.repo.update(id, data);
    if (!updated) throw new AppError(404, 'Event not found during update');
    return updated;
  }

  async remove(id: string, userId: string) {
    const event = await this.repo.findById(id);
    if (!event) throw new AppError(404, 'Event not found');
    
    // TODO: Validate permission
    // if (event.creatorId !== userId) throw new AppError(403, 'Forbidden');

    const deleted = await this.repo.remove(id);
    if (!deleted) throw new AppError(500, 'Failed to delete event');
    return { message: 'Event deleted' };
  }
}
