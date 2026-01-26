import { Calendar } from '../../../generated/prisma/client';

export interface CalendarRepository {
  findAllByUser(userId: string): Promise<Calendar[]>;
  findById(id: string, userId: string): Promise<Calendar | null>;
  create(userId: string, data: any): Promise<Calendar>;
  update(id: string, userId: string, data: any): Promise<{ count: number }>;
  remove(id: string, userId: string): Promise<{ count: number }>;
}
