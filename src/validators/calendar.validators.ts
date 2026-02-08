import { z } from 'zod';

export const createCalendarSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(), 
  color: z.string().optional(),
  isShared: z.boolean().optional(),   
});

export const updateCalendarSchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().optional(),
  description: z.string().optional(), 
  isShared: z.boolean().optional(),  
});
