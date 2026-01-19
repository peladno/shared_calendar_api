import { prisma } from '../utils/prisma.utils';

export const calendarsService = {
  getAllByUser: async (userId: string) => {
    return prisma.calendar.findMany({
      where: { ownerId: userId },
    });
  },

  getById: async (id: string, userId: string) => {
    return prisma.calendar.findFirst({
      where: { id, ownerId: userId },
    });
  },

  create: async (userId: string, data: { name: string }) => {
    return prisma.calendar.create({
      data: {
        name: data.name,
        ownerId: userId,
      },
    });
  },

  update: async (id: string, userId: string, data: any) => {
    return prisma.calendar.updateMany({
      where: { id, ownerId: userId },
      data,
    });
  },

  remove: async (id: string, userId: string) => {
    return prisma.calendar.deleteMany({
      where: { id, ownerId: userId },
    });
  },
};
