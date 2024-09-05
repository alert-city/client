import { create } from 'zustand';
import { Locales } from '@/i18n/routing';
import Cookies from 'js-cookie';

interface UserInfoState {
  currentLocale: string;
  setLanguage: (locale: Locales) => void;
  currentTheme: string;
  setTheme: (theme: string) => void;
}

export const usePreferenceSetting = create<UserInfoState>((set) => ({
  currentLocale: 'en',
  currentTheme: 'light',
  setLanguage: (locale) => set({ currentLocale: locale }),
  setTheme: (theme) => {
    set({ currentTheme: theme });
    Cookies.set('theme', theme);
  },
}));