import { z } from 'zod';

export const passwordSchema = z.string()
  .min(6, 'Password must be at least 6 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number');


export const createUserSchema = z.object({
  username: z.string().min(1, 'Username cannot be empty').max(255).email('Invalid email address'),
  password: passwordSchema,
  confirmPassword: passwordSchema,
  displayName: z.string().min(1, 'Display name cannot be empty').max(255),
  accountType: z.enum(['Personal', 'Organization']),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  orgName: z.string().optional(),
  mobilePhone: z.string()
    .min(1, 'Mobile phone cannot be empty')
    .max(255)
    .regex(/^\+61\d{9}$/, 'Mobile phone number must start with +61 and contain 9 digits after the country code'),
  captchaVerified: z.boolean(),
}).refine(data => data.captchaVerified, {
    message: 'CAPTCHA verification is required',
    path: ['captchaVerified'],
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }).superRefine((
    data,
    ctx,
  ) => {
    // 如果 accountType 是 Personal，检查 firstName 和 lastName
    if (data.accountType === 'Personal') {
      if (!data.firstName) {
        ctx.addIssue({
          path: ['firstName'],
          message: 'First name is required for Personal account type',
          code: 'custom',
        });
      } else if (data.firstName.length < 2 || data.firstName.length > 255) {
        ctx.addIssue({
          path: ['firstName'],
          message: 'First name must be between 2 and 255 characters',
          code: 'custom',
        });
      }

      if (!data.lastName) {
        ctx.addIssue({
          path: ['lastName'],
          message: 'Last name is required for Personal account type',
          code: 'custom',
        });
      } else if (data.lastName.length < 2 || data.lastName.length > 255) {
        ctx.addIssue({
          path: ['lastName'],
          message: 'Last name must be between 2 and 255 characters',
          code: 'custom',
        });
      }
    }

    // 如果 accountType 是 Organization，检查 orgName
    if (data.accountType === 'Organization') {
      if (!data.orgName) {
        ctx.addIssue({
          path: ['orgName'],
          message: 'Organization name is required for Organization account type',
          code: 'custom',
        });
      } else if (data.orgName.length < 2 || data.orgName.length > 255) {
        ctx.addIssue({
          path: ['orgName'],
          message: 'Organization name must be between 2 and 255 characters',
          code: 'custom',
        });
      }
    }
  });

export const updateUserSchema = z.object({
  username: z.string().min(1, 'Email cannot be empty').max(255).email('Invalid email address').optional(),
  displayName: z.string().min(1, 'Display name cannot be empty').max(255).optional(),
  accountType: z.enum(['personal', 'organization']).optional(),
  role: z.array(z.string().min(1, 'Role cannot be empty').max(255)).min(1, 'Role cannot be empty').optional(),
  organization: z.array(z.string().min(1, 'Organization cannot be empty').max(255)).optional(),
  staffs: z.array(z.string().min(1, 'Staff cannot be empty').max(255)).optional().optional(),
  firstName: z.string().min(1, 'First name cannot be empty').max(255).optional(),
  lastName: z.string().min(1, 'Last name cannot be empty').max(255).optional(),
  orgName: z.string().min(1, 'Organization name cannot be empty').max(255).optional(),
  mobilePhone: z.string()
    .min(1, 'Mobile phone cannot be empty')
    .max(255)
    .regex(/^\+61\d{9}$/, 'Mobile phone number must start with +61 and contain 9 digits after the country code')
    .optional(),
  verificationCode: z.string().min(1, 'Verification code cannot be empty').max(255).optional(),
});

