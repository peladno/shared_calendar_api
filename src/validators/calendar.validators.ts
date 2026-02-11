import { z } from 'zod';

export const createCalendarSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().trim().optional(),
  color: z.string().trim().optional(),
  isShared: z.boolean().optional(),
});

export const updateCalendarSchema = z.object({
  name: z.string().trim().min(1).optional(),
  color: z.string().trim().optional(),
  description: z.string().trim().optional(),
  isShared: z.boolean().optional(),
});

export const shareCalendarSchema = z.object({
  email: z.string().email(),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(['ADMIN', 'EDITOR', 'VIEWER']),
});
