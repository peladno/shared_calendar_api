import { prisma } from '../utils/prisma.utils';

export class CalendarsService {
  async getAllByUser(userId: string) {
    return prisma.calendar.findMany({
      where: { ownerId: userId },
    });
  }

  async getById(id: string, userId: string) {
    return prisma.calendar.findFirst({
      where: { id, ownerId: userId },
    });
  }

  async create(
    userId: string,
    data: { name: string; color?: string; description?: string },
  ) {
    return prisma.calendar.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        ownerId: userId,
      },
    });
  }

  async update(id: string, userId: string, data: any) {
    return prisma.calendar.updateMany({
      where: { id, ownerId: userId },
      data,
    });
  }

  async remove(id: string, userId: string) {
    return prisma.calendar.deleteMany({
      where: { id, ownerId: userId },
    });
  }
}
