import { AppError } from '../../utils/error.utils';
import { CalendarRepository } from '../interfaces/calendar.repository';

export class CalendarService {
  constructor(private repo: CalendarRepository) {}

  getAll(userId: string) {
    return this.repo.findAllByUser(userId);
  }

  async getOne(id: string, userId: string) {
    const calendar = await this.repo.findById(id, userId);
    if (!calendar) throw new AppError(404, 'Calendar not found');
    return calendar;
  }

  create(userId: string, data: any) {
    return this.repo.create(userId, data);
  }

  async update(id: string, userId: string, data: any) {
    const result = await this.repo.update(id, userId, data);
    if (result.count === 0) {
      throw new AppError(404, 'Calendar not found or unauthorized');
    }
    return result;
  }

  async remove(id: string, userId: string) {
    const result = await this.repo.remove(id, userId);
    if (result.count === 0) {
      throw new AppError(404, 'Calendar not found or unauthorized');
    }
    return result;
  }
}
