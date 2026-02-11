import { CreateCalendarDTO } from '../../core/dto/calendar/create-calendar.dto';
import { CalendarRepository } from '../../core/interfaces/calendar.repository';
import { prisma } from '../../utils/prisma.utils';
import { Calendar } from '../../core/entities/calendar.entity';
import { Calendar as PrismaCalendar } from '../../../generated/prisma/client';

export class PrismaCalendarRepository implements CalendarRepository {
  private toEntity(c: PrismaCalendar): Calendar {
    return new Calendar(
      c.id,
      c.name,
      c.ownerId,
      c.description,
      c.color,
      c.isShared,
      c.createdAt,
      c.updatedAt,
    );
  }

  async findAllByUser(userId: string): Promise<Calendar[]> {
    const calendars = await prisma.calendar.findMany({
      where: { ownerId: userId },
    });
    return calendars.map((c) => this.toEntity(c));
  }

  async findById(id: string, userId: string): Promise<Calendar | null> {
    const calendar = await prisma.calendar.findFirst({
      where: { id, ownerId: userId },
    });
    return calendar ? this.toEntity(calendar) : null;
  }

  async create(userId: string, data: CreateCalendarDTO): Promise<Calendar> {
    const calendar = await prisma.calendar.create({
      data: { ...data, ownerId: userId },
    });
    return this.toEntity(calendar);
  }

  async update(
    id: string,
    userId: string,
    data: any,
  ): Promise<{ count: number }> {
    return prisma.calendar.updateMany({
      where: { id, ownerId: userId },
      data,
    });
  }

  async remove(id: string, userId: string): Promise<{ count: number }> {
    return prisma.calendar.deleteMany({
      where: { id, ownerId: userId },
    });
  }

  async addMember(
    calendarId: string,
    userId: string,
    role: any,
  ): Promise<any> {
    return prisma.calendarMember.create({
      data: {
        calendarId,
        userId,
        role,
      },
    });
  }

  async updateMemberRole(
    calendarId: string,
    userId: string,
    role: any,
  ): Promise<any> {
    return prisma.calendarMember.update({
      where: {
        calendarId_userId: {
          calendarId,
          userId,
        },
      },
      data: { role },
    });
  }

  async removeMember(calendarId: string, userId: string): Promise<any> {
    return prisma.calendarMember.delete({
      where: {
        calendarId_userId: {
          calendarId,
          userId,
        },
      },
    });
  }
}
