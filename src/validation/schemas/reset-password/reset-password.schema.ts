import { z } from 'zod';
import { useCreateUserSchema } from '@/validation/schemas/user/user.schema';
import { useTranslations } from 'next-intl';

export const useValidationSchemas = () => {
  const t = useTranslations('validation');
  const { passwordSchema } = useCreateUserSchema();

  const getCodeSchema = z.object({
    username: z.string().min(1, { message: t('username.required') }).email({ message: t('username.invalidEmail') }),
  });

  const resetPasswordSchema = z
    .object({
      verificationCode: z.string().min(6, { message: t('verificationCode.minLength') }),
      password: passwordSchema,
      confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('password.match'),
      path: ['confirmPassword'],
    });

  return {
    getCodeSchema,
    resetPasswordSchema,
  };
};