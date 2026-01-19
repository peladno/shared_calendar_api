import { z } from 'zod';

export const createCalendarSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  color: z.string().optional(),
});

export const updateCalendarSchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().optional(),
});
