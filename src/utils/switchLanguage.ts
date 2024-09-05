import { useEffect } from 'react';
import { Locales } from '@/i18n/routing';
import { useRouter } from '@/i18n/routing';
import { usePreferenceSetting } from '@/store/preferenceState';
import { RouteConfig } from '@/routes/route';
import { getPreferenceInfo } from '@/utils/getPreferenceInfo';

type HandlerProps = {
  path?: string;
  locale?: Locales;
};

export function useLanguage() {
  const router = useRouter();
  const { currentLocale, setLanguage } = usePreferenceSetting();

  useEffect(() => {
    getPreferenceInfo().then(({ locale }) => {
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