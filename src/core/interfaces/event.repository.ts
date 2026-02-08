import { Event } from '../entities/event.entity';
import { CreateEventDTO } from '../dto/event/create-event.dto';
import { UpdateEventDTO } from '../dto/event/update-event.dto';

export interface EventRepository {
  findAllByCalendar(calendarId: string): Promise<Event[]>;
  findById(id: string): Promise<Event | null>;
  create(data: CreateEventDTO & { creatorId: string }): Promise<Event>;
  update(id: string, data: UpdateEventDTO): Promise<Event | null>;
  remove(id: string): Promise<boolean>;
}
