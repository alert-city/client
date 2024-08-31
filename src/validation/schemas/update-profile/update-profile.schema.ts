import { z } from 'zod';


export const updateUsernameSchema = z.object({
  username: z.string().min(1, 'Email cannot be empty').max(255).email('Invalid email address'),
});

export const updateMobilePhoneSchema = z.object({
  mobilePhone: z.string()
    .min(1, 'Mobile phone cannot be empty')
    .max(255)
    .regex(/^\+61\d{9}$/, 'Mobile phone number must start with +61 and contain 9 digits after the country code'),
});