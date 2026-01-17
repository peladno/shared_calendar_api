import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { requireCalendarRole } from '../../utils/permissions.utils';
import { prisma } from '../../utils/prisma.utils';
import { CalendarRole } from '../../../generated/prisma/enums';

// Mock prisma
jest.mock('../../utils/prisma.utils', () => ({
  prisma: {
    calendarMember: {
      findFirst: jest.fn(),
    },
  },
}));

describe('requireCalendarRole', () => {
  const mockFindFirst = prisma.calendarMember.findFirst as jest.MockedFunction<
    typeof prisma.calendarMember.findFirst
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('throws 403 error if user role is not allowed', () => {
    it('throws 403 when user is not a member of the calendar', async () => {
      // Arrange
      const userId = 'user-123';
      const calendarId = 'calendar-456';
      const allowedRoles = [CalendarRole.ADMIN, CalendarRole.EDITOR];

      mockFindFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(
        requireCalendarRole(userId, calendarId, allowedRoles)
      ).rejects.toEqual({
        status: 403,
        message: 'Forbidden',
      });

      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { userId, calendarId },
      });
    });

    it('throws 403 when user role is not in allowed roles', async () => {
      // Arrange
      const userId = 'user-789';
      const calendarId = 'calendar-abc';
      const allowedRoles = [CalendarRole.ADMIN];

      const mockMember = {
        id: 'member-1',
        calendarId: 'calendar-abc',
        userId: 'user-789',
        role: CalendarRole.VIEWER,
        joinedAt: new Date(),
      };

      mockFindFirst.mockResolvedValue(mockMember);

      // Act & Assert
      await expect(
        requireCalendarRole(userId, calendarId, allowedRoles)
      ).rejects.toEqual({
        status: 403,
        message: 'Forbidden',
      });

      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { userId, calendarId },
      });
    });

    it('throws 403 when VIEWER tries to access EDITOR-only resource', async () => {
      // Arrange
      const userId = 'viewer-user';
      const calendarId = 'calendar-xyz';
      const allowedRoles = [CalendarRole.ADMIN, CalendarRole.EDITOR];

      const mockMember = {
        id: 'member-2',
        calendarId: 'calendar-xyz',
        userId: 'viewer-user',
        role: CalendarRole.VIEWER,
        joinedAt: new Date(),
      };

      mockFindFirst.mockResolvedValue(mockMember);

      // Act & Assert
      await expect(
        requireCalendarRole(userId, calendarId, allowedRoles)
      ).rejects.toEqual({
        status: 403,
        message: 'Forbidden',
      });
    });

    it('throws 403 when EDITOR tries to access ADMIN-only resource', async () => {
      // Arrange
      const userId = 'editor-user';
      const calendarId = 'calendar-123';
      const allowedRoles = [CalendarRole.ADMIN];

      const mockMember = {
        id: 'member-3',
        calendarId: 'calendar-123',
        userId: 'editor-user',
        role: CalendarRole.EDITOR,
        joinedAt: new Date(),
      };

      mockFindFirst.mockResolvedValue(mockMember);

      // Act & Assert
      await expect(
        requireCalendarRole(userId, calendarId, allowedRoles)
      ).rejects.toEqual({
        status: 403,
        message: 'Forbidden',
      });
    });
  });

  describe('success cases', () => {
    it('returns member when user has allowed role', async () => {
      // Arrange
      const userId = 'admin-user';
      const calendarId = 'calendar-456';
      const allowedRoles = [CalendarRole.ADMIN];

      const mockMember = {
        id: 'member-admin',
        calendarId: 'calendar-456',
        userId: 'admin-user',
        role: CalendarRole.ADMIN,
        joinedAt: new Date('2024-01-01'),
      };

      mockFindFirst.mockResolvedValue(mockMember);

      // Act
      const result = await requireCalendarRole(userId, calendarId, allowedRoles);

      // Assert
      expect(result).toEqual(mockMember);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { userId, calendarId },
      });
    });

    it('returns member when user is ADMIN and multiple roles allowed', async () => {
      // Arrange
      const userId = 'user-multi';
      const calendarId = 'calendar-multi';
      const allowedRoles = [CalendarRole.ADMIN, CalendarRole.EDITOR, CalendarRole.VIEWER];

      const mockMember = {
        id: 'member-multi',
        calendarId: 'calendar-multi',
        userId: 'user-multi',
        role: CalendarRole.ADMIN,
        joinedAt: new Date(),
      };

      mockFindFirst.mockResolvedValue(mockMember);

      // Act
      const result = await requireCalendarRole(userId, calendarId, allowedRoles);

      // Assert
      expect(result).toEqual(mockMember);
    });

    it('returns member when user is EDITOR and EDITOR is allowed', async () => {
      // Arrange
      const userId = 'editor-allowed';
      const calendarId = 'calendar-edit';
      const allowedRoles = [CalendarRole.EDITOR];

      const mockMember = {
        id: 'member-editor',
        calendarId: 'calendar-edit',
        userId: 'editor-allowed',
        role: CalendarRole.EDITOR,
        joinedAt: new Date(),
      };

      mockFindFirst.mockResolvedValue(mockMember);

      // Act
      const result = await requireCalendarRole(userId, calendarId, allowedRoles);

      // Assert
      expect(result).toEqual(mockMember);
    });

    it('returns member when user is VIEWER and VIEWER is allowed', async () => {
      // Arrange
      const userId = 'viewer-allowed';
      const calendarId = 'calendar-view';
      const allowedRoles = [CalendarRole.VIEWER, CalendarRole.EDITOR, CalendarRole.ADMIN];

      const mockMember = {
        id: 'member-viewer',
        calendarId: 'calendar-view',
        userId: 'viewer-allowed',
        role: CalendarRole.VIEWER,
        joinedAt: new Date(),
      };

      mockFindFirst.mockResolvedValue(mockMember);

      // Act
      const result = await requireCalendarRole(userId, calendarId, allowedRoles);

      // Assert
      expect(result).toEqual(mockMember);
      expect(result.role).toBe(CalendarRole.VIEWER);
    });
  });

  describe('database query verification', () => {
    it('queries database with correct userId and calendarId', async () => {
      // Arrange
      const userId = 'query-user';
      const calendarId = 'query-calendar';
      const allowedRoles = [CalendarRole.ADMIN];

      mockFindFirst.mockResolvedValue({
        id: 'member-query',
        calendarId: 'query-calendar',
        userId: 'query-user',
        role: CalendarRole.ADMIN,
        joinedAt: new Date(),
      });

      // Act
      await requireCalendarRole(userId, calendarId, allowedRoles);

      // Assert
      expect(mockFindFirst).toHaveBeenCalledTimes(1);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
          userId: 'query-user',
          calendarId: 'query-calendar',
        },
      });
    });

    it('only calls database once per check', async () => {
      // Arrange
      const userId = 'single-call-user';
      const calendarId = 'single-call-calendar';
      const allowedRoles = [CalendarRole.EDITOR];

      mockFindFirst.mockResolvedValue({
        id: 'member-single',
        calendarId: 'single-call-calendar',
        userId: 'single-call-user',
        role: CalendarRole.EDITOR,
        joinedAt: new Date(),
      });

      // Act
      await requireCalendarRole(userId, calendarId, allowedRoles);

      // Assert
      expect(mockFindFirst).toHaveBeenCalledTimes(1);
    });
  });

  describe('error object structure', () => {
    it('throws error with exactly status 403', async () => {
      // Arrange
      mockFindFirst.mockResolvedValue(null);

      // Act & Assert
      try {
        await requireCalendarRole('user', 'calendar', [CalendarRole.ADMIN]);
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error).toHaveProperty('status', 403);
        expect(error).toHaveProperty('message', 'Forbidden');
        expect(Object.keys(error)).toEqual(['status', 'message']);
      }
    });

    it('throws error with message "Forbidden"', async () => {
      // Arrange
      mockFindFirst.mockResolvedValue({
        id: 'member-forbidden',
        calendarId: 'calendar-test',
        userId: 'user-test',
        role: CalendarRole.VIEWER,
        joinedAt: new Date(),
      });

      // Act & Assert
      try {
        await requireCalendarRole('user-test', 'calendar-test', [CalendarRole.ADMIN]);
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toBe('Forbidden');
      }
    });
  });
});
