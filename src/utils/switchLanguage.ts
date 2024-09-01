import { useEffect } from 'react';
import { Locales } from '@/i18n/routing';
import { useRouter } from '@/i18n/routing';
import { useLanguageSetting } from '@/store/switchLanguage';
import { RouteConfig } from '@/routes/route';
import { getNextLocale } from '@/utils/get-next-locale';

type HandlerProps = {
  path?: string;
  locale?: Locales;
};

export function useLanguage() {
  const router = useRouter();
  const { currentLocale, setLanguage } = useLanguageSetting();

  useEffect(() => {
    getNextLocale().then((locale) => {
      setLanguage(locale as Locales);
    });
  }, [currentLocale]);

  function languageSwitcher({
    path = RouteConfig.Preferences.Path,
    locale,
  }: HandlerProps) {
    setLanguage(locale as Locales);
    router.replace(path, {
      locale,
    });
  }

  return {
    currentLocale,
    setLanguage,
    languageSwitcher,
  };
}