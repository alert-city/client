import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(2, 'Password must be at least 6 characters'),
  stay_signed_in: z.boolean(),
});