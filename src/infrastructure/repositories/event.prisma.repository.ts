import { EventRepository } from '../../core/interfaces/event.repository';
import { prisma } from '../../utils/prisma.utils';
import { Event } from '../../core/entities/event.entity';
import { CreateEventDTO } from '../../core/dto/event/create-event.dto';
import { UpdateEventDTO } from '../../core/dto/event/update-event.dto';
import { Event as PrismaEvent } from '../../../generated/prisma/client';

export class PrismaEventRepository implements EventRepository {
  private toEntity(e: PrismaEvent): Event {
    return new Event(
      e.id,
      e.title,
      e.startTime,
      e.endTime,
      e.calendarId,
      e.creatorId,
      e.description,
      e.isAllDay,
      e.location,
      e.color,
      e.isRecurring,
      e.recurrence,
      e.createdAt,
      e.updatedAt
    );
  }

  async findAllByCalendar(calendarId: string): Promise<Event[]> {
    const events = await prisma.event.findMany({
      where: { calendarId: calendarId },
    });
    return events.map((e) => this.toEntity(e));
  }

  async findById(id: string): Promise<Event | null> {
    const event = await prisma.event.findUnique({
      where: { id },
    });
    return event ? this.toEntity(event) : null;
  }

  async create(data: CreateEventDTO & { creatorId: string }): Promise<Event> {
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        isAllDay: data.isAllDay ?? false,
        location: data.location,
        color: data.color,
        isRecurring: data.isRecurring ?? false,
        recurrence: data.recurrence,
        calendarId: data.calendarId,
        creatorId: data.creatorId,
      },
    });
    return this.toEntity(event);
  }

  async update(id: string, data: UpdateEventDTO): Promise<Event | null> {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.startTime !== undefined) updateData.startTime = new Date(data.startTime);
    if (data.endTime !== undefined) updateData.endTime = new Date(data.endTime);
    if (data.isAllDay !== undefined) updateData.isAllDay = data.isAllDay;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.isRecurring !== undefined) updateData.isRecurring = data.isRecurring;
    if (data.recurrence !== undefined) updateData.recurrence = data.recurrence;
    if (data.calendarId !== undefined) updateData.calendarId = data.calendarId;

    try {
      const event = await prisma.event.update({
        where: { id },
        data: updateData,
      });
      return this.toEntity(event);
    } catch (error) {
       // Check for record not found error (P2025) if needed, but returning null or letting it throw is also fine depending on specific error handling strategy usually defined in services.
       // However, update throws if not found in Prisma, unlike updateMany which returns count.
       // For repository pattern returning null on update(id) if not found is safer if we want to abstract database errors.
       // But typically we findById first in service, check ownership, then update.
       // Here, let's just let it throw or handle it.
       // Let's stick to simple implementation for now.
       return null;
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await prisma.event.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }
}
