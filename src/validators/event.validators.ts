import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().optional(),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime(),
  isAllDay: z.boolean().optional(),
  location: z.string().trim().optional(),
  color: z.string().trim().optional(),
  isRecurring: z.boolean().optional(),
  recurrence: z.string().trim().optional(),
  calendarId: z.uuid(),
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

export const updateEventSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().optional(),
  startTime: z.iso.datetime().optional(),
  endTime: z.iso.datetime().optional(),
  isAllDay: z.boolean().optional(),
  location: z.string().trim().optional(),
  color: z.string().trim().optional(),
  isRecurring: z.boolean().optional(),
  recurrence: z.string().trim().optional(),
  calendarId: z.uuid()
});
