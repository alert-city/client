import { z } from 'zod';
import { useTranslations } from 'next-intl';

export const useValidationSchemas = () => {
  const t = useTranslations('validation');

  const updateUsernameSchema = z.object({
    username: z
      .string()
      .min(1, { message: t('username.required') })
      .max(255)
      .email({ message: t('username.invalidEmail') }),
  });

  const updatePhoneNumberSchema = z.object({
    phoneNumber: z
      .string()
      .min(1, { message: t('phoneNumber.required') })
      .max(255)
      .regex(/^(?:\+61|0)([2378]\d{8}|4\d{8})$/, t('phoneNumber.format')),
  });

  return {
    updateUsernameSchema,
    updatePhoneNumberSchema,
  };
};