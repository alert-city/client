import { lightTheme, darkTheme } from '@/modules/theme/themeColour';
import { create } from 'zustand';
import { Theme } from '@mui/material/styles';
import { useEffect } from 'react';
import { THEME, LIGHT_THEME, DARK_THEME, SYSTEM, DARK, LIGHT, IS_DARK } from '@/shared/constants/storage';

export type ThemeKey = typeof LIGHT_THEME | typeof DARK_THEME | typeof SYSTEM;

type ThemeState = {
  currentTheme: Theme;
  themeMode: ThemeKey;
  setTheme: (themeKey: ThemeKey) => void;
  isSystemDark: boolean;
};

export const useThemeStore = create<ThemeState>((set) => {
  let systemPrefersDark = false;
  let systemTheme = lightTheme;
  if (typeof window !== 'undefined') {
    systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    systemTheme = systemPrefersDark ? darkTheme : lightTheme;
  }
  const themeFromStorage = typeof window !== 'undefined' && localStorage.getItem(THEME) as ThemeKey;
  const savedTheme = themeFromStorage ? themeFromStorage : SYSTEM;
  let initialTheme: Theme;
  if (savedTheme === SYSTEM) {
    initialTheme = systemTheme;
  } else if (savedTheme === DARK_THEME) {
    initialTheme = darkTheme;
  } else {
    initialTheme = lightTheme;
  }

  return {
    currentTheme: initialTheme,
    themeMode: savedTheme || SYSTEM,
    isSystemDark: systemPrefersDark,
    setTheme: (themeKey: ThemeKey) => {
      if (themeKey === SYSTEM) {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const newSystemTheme = systemPrefersDark ? darkTheme : lightTheme;
        set({ currentTheme: newSystemTheme, themeMode: themeKey, isSystemDark: systemPrefersDark });
      } else {
        const newTheme = themeKey === DARK_THEME ? darkTheme : lightTheme;
        set({ currentTheme: newTheme, themeMode: themeKey });
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME, themeKey);
      }
    },
  };
});

const useTheme = () => {
  const { currentTheme, themeMode, setTheme, isSystemDark } = useThemeStore();

  const toggleTheme = (theme: string) => {
    const newTheme = theme === SYSTEM ? SYSTEM : theme === DARK ? DARK_THEME : LIGHT_THEME;
    setTheme(newTheme as ThemeKey);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      if (themeMode === SYSTEM) {
        setTheme(SYSTEM);
      }
    };
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [themeMode, setTheme]);

  let displayTheme: string;
  if (themeMode === SYSTEM) {
    displayTheme = SYSTEM;
  } else if (themeMode === DARK_THEME) {
    displayTheme = DARK;
  } else {
    displayTheme = LIGHT;
  }

  const isDark = displayTheme === DARK ? true : (displayTheme === LIGHT ? false : isSystemDark);
  localStorage.setItem(IS_DARK, (isDark ? "1" : "0"));

  return { currentTheme, toggleTheme, displayTheme, isSystemDark };
};

export default useTheme;





