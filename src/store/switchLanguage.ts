import create from 'zustand';
import { Locales } from '@/i18n/routing';

interface UserInfoState {
  currentLocale: string;
  setLanguage: (locale: Locales) => void;
}

export const useLanguageSetting = create<UserInfoState>((set) => ({
  currentLocale: 'en',
  setLanguage: (locale) => set({ currentLocale: locale }),
}));