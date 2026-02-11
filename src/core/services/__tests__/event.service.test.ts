import { EventService } from '../event.service';
import { EventRepository } from '../../interfaces/event.repository';
import { CalendarRepository } from '../../interfaces/calendar.repository';
import { Event } from '../../entities/event.entity';
import { AppError } from '../../../utils/error.utils';

describe('EventService', () => {
  let service: EventService;
  let mockRepo: jest.Mocked<EventRepository>;
  let mockCalendarRepo: jest.Mocked<CalendarRepository>;

  beforeEach(() => {
    mockRepo = {
      findAllByCalendar: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;
    mockCalendarRepo = {
      findById: jest.fn(),
    } as any;
    service = new EventService(mockRepo, mockCalendarRepo);
  });

  const userId = 'user1';
  const calendarId = 'cal1';
  const eventId = 'event1';
  const mockEvent = new Event(
    eventId,
    'Test Event',
    new Date(),
    new Date(),
    calendarId,
    userId,
    'Description'
  );

  describe('getAll', () => {
    it('should return all events for a calendar if user has access', async () => {
      mockCalendarRepo.findById.mockResolvedValue({ id: calendarId } as any);
      mockRepo.findAllByCalendar.mockResolvedValue([mockEvent]);
      const result = await service.getAll(calendarId, userId);
      expect(result).toEqual([mockEvent]);
      expect(mockCalendarRepo.findById).toHaveBeenCalledWith(calendarId, userId);
    });

    it('should throw Error if calendar not found or unauthorized', async () => {
      mockCalendarRepo.findById.mockResolvedValue(null);
      await expect(service.getAll(calendarId, userId)).rejects.toThrow(AppError);
    });
  });

  describe('getOne', () => {
    it('should return an event by id if user has access to its calendar', async () => {
      mockRepo.findById.mockResolvedValue(mockEvent);
      mockCalendarRepo.findById.mockResolvedValue({ id: calendarId } as any);
      const result = await service.getOne(eventId, userId);
      expect(result).toEqual(mockEvent);
      expect(mockCalendarRepo.findById).toHaveBeenCalledWith(calendarId, userId);
    });

    it('should throw Forbidden if user has no access to events calendar', async () => {
      mockRepo.findById.mockResolvedValue(mockEvent);
      mockCalendarRepo.findById.mockResolvedValue(null);
      await expect(service.getOne(eventId, userId)).rejects.toHaveProperty('statusCode', 403);
    });

    it('should throw AppError if event not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.getOne(eventId, userId)).rejects.toThrow(AppError);
    });
  });

  describe('create', () => {
    it('should create a new event if user has access to calendar', async () => {
      const createDto = {
        title: 'New Event',
        startTime: new Date(),
        endTime: new Date(),
        calendarId: calendarId,
      };
      mockCalendarRepo.findById.mockResolvedValue({ id: calendarId } as any);
      mockRepo.create.mockResolvedValue(mockEvent);
      const result = await service.create(userId, createDto);
      expect(result).toEqual(mockEvent);
      expect(mockCalendarRepo.findById).toHaveBeenCalledWith(calendarId, userId);
    });

    it('should throw error if target calendar not found/unauthorized', async () => {
      mockCalendarRepo.findById.mockResolvedValue(null);
      await expect(service.create(userId, { calendarId: 'invalid' } as any)).rejects.toThrow(AppError);
    });
  });

  describe('update', () => {
    it('should update an existing event', async () => {
      const updateDto = { title: 'Updated Event' };
      mockRepo.findById.mockResolvedValue(mockEvent);
      mockRepo.update.mockResolvedValue({ ...mockEvent, ...updateDto });
      
      const result = await service.update(eventId, userId, updateDto);
      
      expect(result.title).toBe('Updated Event');
      expect(mockRepo.update).toHaveBeenCalledWith(eventId, updateDto);
    });

    it('should throw AppError if event to update not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.update(eventId, userId, {})).rejects.toThrow(AppError);
    });

    it('should throw Forbidden error if user is not the creator', async () => {
      mockRepo.findById.mockResolvedValue({ ...mockEvent, creatorId: 'otherUser' });
      await expect(service.update(eventId, userId, {})).rejects.toThrow(AppError);
      await expect(service.update(eventId, userId, {})).rejects.toHaveProperty('statusCode', 403);
    });
  });

  describe('remove', () => {
    it('should remove an event', async () => {
      mockRepo.findById.mockResolvedValue(mockEvent);
      mockRepo.remove.mockResolvedValue(true);
      
      const result = await service.remove(eventId, userId);
      
      expect(result).toEqual({ message: 'Event deleted' });
      expect(mockRepo.remove).toHaveBeenCalledWith(eventId);
    });

    it('should throw AppError if event to remove not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.remove(eventId, userId)).rejects.toThrow(AppError);
    });

    it('should throw Forbidden error if user is not the creator during removal', async () => {
      mockRepo.findById.mockResolvedValue({ ...mockEvent, creatorId: 'otherUser' });
      await expect(service.remove(eventId, userId)).rejects.toThrow(AppError);
      await expect(service.remove(eventId, userId)).rejects.toHaveProperty('statusCode', 403);
    });

    it('should throw AppError if deletion fails', async () => {
      mockRepo.findById.mockResolvedValue(mockEvent);
      mockRepo.remove.mockResolvedValue(false);
      await expect(service.remove(eventId, userId)).rejects.toThrow(AppError);
    });
  });
});
