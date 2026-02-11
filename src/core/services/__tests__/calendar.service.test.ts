import { CalendarService } from '../calendar.service';
import { CalendarRepository } from '../../interfaces/calendar.repository';
import { AuthRepository } from '../../interfaces/auth.repository';
import { Calendar } from '../../entities/calendar.entity';
import { User } from '../../entities/user.entity';
import { AppError } from '../../../utils/error.utils';

describe('CalendarService', () => {
  let service: CalendarService;
  let mockRepo: jest.Mocked<CalendarRepository>;
  let mockAuthRepo: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    mockRepo = {
      findAllByUser: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      addMember: jest.fn(),
      updateMemberRole: jest.fn(),
      removeMember: jest.fn(),
    };
    mockAuthRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      createUser: jest.fn(),
    };
    service = new CalendarService(mockRepo, mockAuthRepo);
  });

  const userId = 'user1';
  const calendarId = 'cal1';
  const mockCalendar = new Calendar(calendarId, 'My Calendar', userId);

  describe('getAll', () => {
    it('should return all calendars for user', async () => {
      mockRepo.findAllByUser.mockResolvedValue([mockCalendar]);
      const result = await service.getAll(userId);
      expect(result).toEqual([mockCalendar]);
    });
  });

  describe('getOne', () => {
    it('should return one calendar', async () => {
      mockRepo.findById.mockResolvedValue(mockCalendar);
      const result = await service.getOne(calendarId, userId);
      expect(result).toEqual(mockCalendar);
    });

    it('should throw error if not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.getOne(calendarId, userId)).rejects.toThrow(AppError);
    });
  });

  describe('create', () => {
    it('should create a calendar', async () => {
      const data = { name: 'New Cal' };
      mockRepo.create.mockResolvedValue(mockCalendar);
      const result = await service.create(userId, data);
      expect(result).toEqual(mockCalendar);
    });
  });

  describe('update', () => {
    it('should update calendar', async () => {
      mockRepo.update.mockResolvedValue({ count: 1 });
      const result = await service.update(calendarId, userId, { name: 'Updated' });
      expect(result.count).toBe(1);
    });

    it('should throw error if not updated/found', async () => {
      mockRepo.update.mockResolvedValue({ count: 0 });
      await expect(service.update(calendarId, userId, {})).rejects.toThrow(AppError);
    });
  });

  describe('remove', () => {
    it('should remove calendar', async () => {
      mockRepo.remove.mockResolvedValue({ count: 1 });
      const result = await service.remove(calendarId, userId);
      expect(result.count).toBe(1);
    });

    it('should throw error if not removed/found', async () => {
      mockRepo.remove.mockResolvedValue({ count: 0 });
      await expect(service.remove(calendarId, userId)).rejects.toThrow(AppError);
    });
  });

  describe('shareCalendar', () => {
    const email = 'other@test.com';
    const otherUser = new User('user2', email, 'otheruser', 'hash');

    it('should share calendar with EDITOR role', async () => {
      mockRepo.findById.mockResolvedValue(mockCalendar);
      mockAuthRepo.findByEmail.mockResolvedValue(otherUser);
      mockRepo.addMember.mockResolvedValue({ id: 'member1' });

      const result = await service.shareCalendar(calendarId, userId, email);

      expect(mockRepo.addMember).toHaveBeenCalledWith(calendarId, otherUser.id, 'EDITOR');
      expect(result).toBeDefined();
    });

    it('should throw error if user shares with themselves', async () => {
      mockRepo.findById.mockResolvedValue(mockCalendar);
      mockAuthRepo.findByEmail.mockResolvedValue(new User(userId, 'me@test.com', 'me', 'hash'));

      await expect(service.shareCalendar(calendarId, userId, 'me@test.com')).rejects.toThrow('Cannot share calendar with yourself');
    });
  });

  describe('updateMemberRole', () => {
    it('should update role if owner', async () => {
      mockRepo.findById.mockResolvedValue(mockCalendar);
      mockRepo.updateMemberRole.mockResolvedValue({ id: 'member1' });

      await service.updateMemberRole(calendarId, userId, 'user2', 'ADMIN');

      expect(mockRepo.updateMemberRole).toHaveBeenCalledWith(calendarId, 'user2', 'ADMIN');
    });
  });

  describe('removeMember', () => {
    it('should remove member if owner', async () => {
      mockRepo.findById.mockResolvedValue(mockCalendar);
      mockRepo.removeMember.mockResolvedValue({ id: 'member1' });

      await service.removeMember(calendarId, userId, 'user2');

      expect(mockRepo.removeMember).toHaveBeenCalledWith(calendarId, 'user2');
    });
  });
});
