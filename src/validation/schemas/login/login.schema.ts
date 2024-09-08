import { z } from 'zod';
import { useTranslations } from 'next-intl';

export const useLoginSchema = () => {
  const t = useTranslations('validation');

  return z.object({
    username: z
      .string()
      .min(1, { message: t('username.required') })
      .email({ message: t('username.invalidEmail') }),
    password: z
      .string()
      .min(8, { message: t('password.minLength') }),
    isStaySignedIn: z.boolean(),
  });
};