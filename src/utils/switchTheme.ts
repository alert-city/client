import { useEffect } from 'react';
import { usePreferenceSetting } from '@/store/preferenceState';
import { getPreferenceInfo } from '@/utils/getPreferenceInfo';
import { THEME } from '@/shared/constants/storage';

export function useTheme() {
  const { currentTheme, setTheme } = usePreferenceSetting();

  useEffect(() => {
    getPreferenceInfo().then(({ theme }) => {
      console.log('theme', theme);
      setTheme(theme || 'light');
    });
  }, [currentTheme]);

  const themeSwitcher = (theme: string) => {
    setTheme(theme);
  };

  return {
    currentTheme,
    themeSwitcher,
  };
}