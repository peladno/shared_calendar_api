import { CalendarRole } from '../../generated/prisma/enums';
import { prisma } from './prisma.utils';

export async function requireCalendarRole(
  userId: string,
  calendarId: string,
  allowedRoles: CalendarRole[]
) {
  const member = await prisma.calendarMember.findFirst({
    where: { userId, calendarId },
  });

  if (!member || !allowedRoles.includes(member.role)) {
    throw { status: 403, message: 'Forbidden' };
  }

  return member;
}
