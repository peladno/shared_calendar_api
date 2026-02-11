import { Calendar } from '../entities/calendar.entity';

export interface CalendarRepository {
  findAllByUser(userId: string): Promise<Calendar[]>;
  findById(id: string, userId: string): Promise<Calendar | null>;
  create(userId: string, data: any): Promise<Calendar>;
  update(id: string, userId: string, data: any): Promise<{ count: number }>;
  remove(id: string, userId: string): Promise<{ count: number }>;
  addMember(calendarId: string, userId: string, role: string): Promise<any>;
  updateMemberRole(calendarId: string, userId: string, role: string): Promise<any>;
  removeMember(calendarId: string, userId: string): Promise<any>;
}
