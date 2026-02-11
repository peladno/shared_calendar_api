import { AppError } from '../../utils/error.utils';
import { CalendarRepository } from '../interfaces/calendar.repository';
import { AuthRepository } from '../interfaces/auth.repository';

export class CalendarService {
  constructor(
    private repo: CalendarRepository,
    private authRepo: AuthRepository,
  ) {}

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

  async shareCalendar(calendarId: string, ownerId: string, email: string) {
    const calendar = await this.repo.findById(calendarId, ownerId);
    if (!calendar) throw new AppError(404, 'Calendar not found or unauthorized');

    const userToShare = await this.authRepo.findByEmail(email);
    if (!userToShare) throw new AppError(404, 'User not found');

    if (userToShare.id === ownerId) {
      throw new AppError(400, 'Cannot share calendar with yourself');
    }

    return this.repo.addMember(calendarId, userToShare.id, 'EDITOR');
  }

  async updateMemberRole(
    calendarId: string,
    ownerId: string,
    userId: string,
    role: string,
  ) {
    const calendar = await this.repo.findById(calendarId, ownerId);
    if (!calendar) throw new AppError(404, 'Calendar not found or unauthorized');

    return this.repo.updateMemberRole(calendarId, userId, role);
  }

  async removeMember(calendarId: string, ownerId: string, userId: string) {
    const calendar = await this.repo.findById(calendarId, ownerId);
    if (!calendar) throw new AppError(404, 'Calendar not found or unauthorized');

    return this.repo.removeMember(calendarId, userId);
  }
}
