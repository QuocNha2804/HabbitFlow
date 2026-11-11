import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  USERS: '@habitflow_users',
  CURRENT_USER: '@habitflow_current_user',
  HABITS: '@habitflow_habits',
  HABIT_LOGS: '@habitflow_habit_logs',
  THEME_MODE: '@habitflow_theme_mode',
  ONBOARDING_DONE: '@habitflow_onboarding_done',
  SETTINGS: '@habitflow_settings',
};

export const storageService = {
  async getItem<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const val = await AsyncStorage.getItem(key);
      if (val === null) return defaultValue;
      return JSON.parse(val) as T;
    } catch (error) {
      console.warn(`[storageService] Error reading ${key}:`, error);
      return defaultValue;
    }
  },

  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`[storageService] Error writing ${key}:`, error);
      return false;
    }
  },

  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`[storageService] Error removing ${key}:`, error);
      return false;
    }
  },

  async clearAll(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.warn(`[storageService] Error clearing storage:`, error);
      return false;
    }
  },
};
