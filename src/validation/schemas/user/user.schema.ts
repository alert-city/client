import { z } from 'zod';
import { useTranslations } from 'next-intl';

export const useCreateUserSchema = () => {
  const t = useTranslations('validation'); // 获取翻译钩子

  const passwordSchema = z.string()
    .min(8, t('password.minLength'))
    .regex(/[A-Z]/, t('password.uppercase'))
    .regex(/[a-z]/, t('password.lowercase'))
    .regex(/\d/, t('password.number'))
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/, t('password.specialChar'));

  const createUserSchema = z.object({
    username: z.string()
      .min(1, t('username.required'))
      .max(255)
      .email(t('username.invalidEmail')),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    displayName: z.string().min(1, t('displayName.required')).max(255),
    accountType: z.enum(['Personal', 'Organization']),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    orgName: z.string().optional(),
    phoneNumber: z.string()
      .min(1, t('phoneNumber.required'))
      .max(255)
      .regex(/^(?:\+61|0)([2378]\d{8}|4\d{8})$/, t('phoneNumber.format')),
    captchaVerified: z.boolean(),
  })
    .refine(data => data.captchaVerified, {
      message: t('captcha.required'),
      path: ['captchaVerified'],
    })
    .refine(data => data.password === data.confirmPassword, {
      message: t('password.match'),
      path: ['confirmPassword'],
    })
    .superRefine((data, ctx) => {
      // 如果 accountType 是 Personal，检查 firstName 和 lastName
      if (data.accountType === 'Personal') {
        if (!data.firstName) {
          ctx.addIssue({
            path: ['firstName'],
            message: t('firstName.required'),
            code: 'custom',
          });
        } else if (data.firstName.length < 1 || data.firstName.length > 100) {
          ctx.addIssue({
            path: ['firstName'],
            message: t('firstName.length'),
            code: 'custom',
          });
        }
        if (!data.lastName) {
          ctx.addIssue({
            path: ['lastName'],
            message: t('lastName.required'),
            code: 'custom',
          });
        } else if (data.lastName.length < 1 || data.lastName.length > 100) {
          ctx.addIssue({
            path: ['lastName'],
            message: t('lastName.length'),
            code: 'custom',
          });
        }
      }
      // 如果 accountType 是 Organization，检查 orgName
      if (data.accountType === 'Organization') {
        if (!data.orgName) {
          ctx.addIssue({
            path: ['orgName'],
            message: t('orgName.required'),
            code: 'custom',
          });
        } else if (data.orgName.length < 1 || data.orgName.length > 255) {
          ctx.addIssue({
            path: ['orgName'],
            message: t('orgName.length'),
            code: 'custom',
          });
        }
      }
    });

  return { createUserSchema, passwordSchema };
};
