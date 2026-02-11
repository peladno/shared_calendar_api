import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email().trim().toLowerCase(),
  username: z.string().trim().min(3),
  password: z.string().trim().min(6),
});

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().trim().min(6),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
