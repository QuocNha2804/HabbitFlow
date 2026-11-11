import { create } from 'zustand';
import { lightColors, darkColors, ThemeColors } from '../theme/colors';
import { storageService, STORAGE_KEYS } from '../services/storageService';

interface ThemeState {
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setDarkMode: (value: boolean) => void;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDarkMode: false,
  colors: lightColors,

  toggleTheme: () => {
    const nextMode = !get().isDarkMode;
    set({
      isDarkMode: nextMode,
      colors: nextMode ? darkColors : lightColors,
    });
    storageService.setItem(STORAGE_KEYS.THEME_MODE, nextMode);
  },

  setDarkMode: (value: boolean) => {
    set({
      isDarkMode: value,
      colors: value ? darkColors : lightColors,
    });
    storageService.setItem(STORAGE_KEYS.THEME_MODE, value);
  },

  loadTheme: async () => {
    const saved = await storageService.getItem<boolean>(STORAGE_KEYS.THEME_MODE, false);
    set({
      isDarkMode: saved,
      colors: saved ? darkColors : lightColors,
    });
  },
}));
