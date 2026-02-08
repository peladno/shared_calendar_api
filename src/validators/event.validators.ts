import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  isAllDay: z.boolean().optional(),
  location: z.string().optional(),
  color: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurrence: z.string().optional(),
  calendarId: z.string().uuid(),
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
  isAllDay: z.boolean().optional(),
  location: z.string().optional(),
  color: z.string().optional(),
  isRecurring: z.boolean().optional(),
  recurrence: z.string().optional(),
  calendarId: z.string().uuid().optional(),
});
