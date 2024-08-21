import { z } from 'zod';

export const passwordSchema = z.string()
  .min(6, 'Password must be at least 6 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number');

export const securityQuestionSchema = z.object({
  question: z.string().min(1, "Security question cannot be empty").max(255),
  answer: z.string().min(1, "Answer cannot be empty").max(255),
});


export const createUserSchema = z.object({
  username: z.string().min(1, "Username cannot be empty").max(255).email("Invalid email address"),
  password: passwordSchema,
  confirmPassword: passwordSchema,
  displayName: z.string().min(1, "Display name cannot be empty").max(255),
  accountType: z.enum(["Personal", "Organization"]),
  // role: z.array(z.string().min(1, "Role cannot be empty").max(255)).optional(),
  name: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  }).optional(),
  orgName: z.string().optional(),
  mobilePhone: z.string()
    .min(1, "Mobile phone cannot be empty")
    .max(255)
    .regex(/^\+61\d{9}$/, "Mobile phone number must start with +61 and contain 9 digits after the country code"),
  securityQuestion1: z.string().min(1, "Security question 1 cannot be empty").max(255),
  securityAnswer1: z.string().min(1, "Answer 1 cannot be empty").max(255),
  securityQuestion2: z.string().min(1, "Security question 2 cannot be empty").max(255),
  securityAnswer2: z.string().min(1, "Answer 2 cannot be empty").max(255),
  securityQuestion3: z.string().min(1, "Security question 3 cannot be empty").max(255),
  securityAnswer3: z.string().min(1, "Answer 3 cannot be empty").max(255),
  captchaVerified: z.boolean().refine(value => value, {
    message: 'CAPTCHA verification failed',
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).superRefine((data, ctx) => {
  // 如果 accountType 是 Personal，检查 firstName 和 lastName
  if (data.accountType === 'Personal') {
    if (!data.name?.firstName) {
      ctx.addIssue({
        path: ['name', 'firstName'],
        message: 'First name is required for Personal account type',
        code: 'custom',
      });
    }
    if (!data.name?.lastName) {
      ctx.addIssue({
        path: ['name', 'lastName'],
        message: 'Last name is required for Personal account type',
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
    }
  }
})
.superRefine((data, ctx) => {
  const { securityQuestion1, securityQuestion2, securityQuestion3 } = data;
  const uniqueQuestions = new Set<string>();
  const duplicatePaths: string[] = [];

  // 检查唯一性
  if (securityQuestion1) {
    if (uniqueQuestions.has(securityQuestion1)) {
      duplicatePaths.push('securityQuestion1');
    } else {
      uniqueQuestions.add(securityQuestion1);
    }
  }

  if (securityQuestion2) {
    if (uniqueQuestions.has(securityQuestion2)) {
      duplicatePaths.push('securityQuestion2');
    } else {
      uniqueQuestions.add(securityQuestion2);
    }
  }

  if (securityQuestion3) {
    if (uniqueQuestions.has(securityQuestion3)) {
      duplicatePaths.push('securityQuestion3');
    } else {
      uniqueQuestions.add(securityQuestion3);
    }
  }

  // 如果有重复项，在每个重复项下添加错误信息
  duplicatePaths.forEach((path) => {
    ctx.addIssue({
      path: [path],
      message: 'Security questions must be unique',
      code: 'custom',
    });
  });
});

export const updateUserSchema = z.object({
  username: z.string().min(1, "Email cannot be empty").max(255).email("Invalid email address").optional(),
  displayName: z.string().min(1, "Display name cannot be empty").max(255).optional(),
  accountType: z.enum(["personal", "organization"]).optional(),
  role: z.array(z.string().min(1, "Role cannot be empty").max(255)).min(1, "Role cannot be empty").optional(),
  organization: z.array(z.string().min(1, "Organization cannot be empty").max(255)).optional(),
  staffs: z.array(z.string().min(1, "Staff cannot be empty").max(255)).optional().optional(),
  name: z.object({
    firstName: z.string().min(1, "First name cannot be empty").max(255).optional(),
    lastName: z.string().min(1, "Last name cannot be empty").max(255).optional(),
  }).optional(),
  orgName: z.string().min(1, "Organization name cannot be empty").max(255).optional(),
  mobilePhone: z.string()
    .min(1, "Mobile phone cannot be empty")
    .max(255)
    .regex(/^\+61\d{9}$/, "Mobile phone number must start with +61 and contain 9 digits after the country code")
    .optional(),
  verificationCode: z.string().min(1, "Verification code cannot be empty").max(255).optional(),
});

