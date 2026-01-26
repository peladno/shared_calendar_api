import { CreateCalendarDTO } from '../../core/dto/calendar/create-calendar.dto';
import { CalendarRepository } from '../../core/interfaces/calendar.repository';
import { prisma } from '../../utils/prisma.utils';

export class PrismaCalendarRepository implements CalendarRepository {
  findAllByUser(userId: string) {
    return prisma.calendar.findMany({ where: { ownerId: userId } });
  }

  findById(id: string, userId: string) {
    return prisma.calendar.findFirst({ where: { id, ownerId: userId } });
  }

  create(userId: string, data: CreateCalendarDTO) {
    return prisma.calendar.create({
      data: { ...data, ownerId: userId },
    });
  }

  update(id: string, userId: string, data: any) {
    return prisma.calendar.updateMany({
      where: { id, ownerId: userId },
      data,
    });
  }

  remove(id: string, userId: string) {
    return prisma.calendar.deleteMany({
      where: { id, ownerId: userId },
    });
  }
}
