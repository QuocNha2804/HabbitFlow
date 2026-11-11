import { create } from 'zustand';
import { User } from '../types';
import { apiService } from '../services/apiService';
import { storageService, STORAGE_KEYS } from '../services/storageService';

interface AuthState {
  currentUser: User | null;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  onboardingGoal: string;
  defaultReminderTime: string;

  setOnboardingGoal: (goal: string) => void;
  setDefaultReminderTime: (time: string) => void;
  completeOnboarding: () => Promise<void>;

  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isLoading: true,
  hasCompletedOnboarding: false,
  onboardingGoal: 'health',
  defaultReminderTime: '08:00',

  setOnboardingGoal: (goal: string) => set({ onboardingGoal: goal }),
  setDefaultReminderTime: (time: string) => set({ defaultReminderTime: time }),

  completeOnboarding: async () => {
    await storageService.setItem(STORAGE_KEYS.ONBOARDING_DONE, true);
    set({ hasCompletedOnboarding: true });
  },

  login: async (email: string, pass: string) => {
    set({ isLoading: true });
    try {
      const res = await apiService.login(email, pass);
      if (res.success && res.data) {
        set({ currentUser: res.data, isLoading: false });
        return { success: true };
      }
      set({ isLoading: false });
      return { success: false, message: res.message || 'Đăng nhập thất bại' };
    } catch {
      set({ isLoading: false });
      return { success: false, message: 'Đã có lỗi xảy ra khi đăng nhập' };
    }
  },

  register: async (name: string, email: string, pass: string) => {
    set({ isLoading: true });
    try {
      const { onboardingGoal, defaultReminderTime } = get();
      const res = await apiService.register({
        name,
        email,
        password: pass,
        selectedGoal: onboardingGoal,
        defaultReminderTime: defaultReminderTime || '08:00',
      });

      if (res.success && res.data) {
        set({ currentUser: res.data, isLoading: false });
        return { success: true, user: res.data };
      }
      set({ isLoading: false });
      return { success: false, message: res.message || 'Đăng ký thất bại' };
    } catch {
      set({ isLoading: false });
      return { success: false, message: 'Đã có lỗi xảy ra khi đăng ký' };
    }
  },

  logout: async () => {
    await storageService.removeItem(STORAGE_KEYS.CURRENT_USER);
    set({ currentUser: null });
  },

  updateProfile: async (updates: Partial<User>) => {
    const current = get().currentUser;
    if (!current) return;
    const updated: User = { ...current, ...updates };
    set({ currentUser: updated });
    await storageService.setItem(STORAGE_KEYS.CURRENT_USER, updated);

    // Cập nhật lại trong mảng USERS
    const users = await storageService.getItem<User[]>(STORAGE_KEYS.USERS, []);
    const updatedUsers = users.map((u) => (u.id === current.id ? updated : u));
    await storageService.setItem(STORAGE_KEYS.USERS, updatedUsers);
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const hasOnboarding = await storageService.getItem<boolean>(STORAGE_KEYS.ONBOARDING_DONE, false);
      const user = await storageService.getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
      set({
        hasCompletedOnboarding: hasOnboarding,
        currentUser: user,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },
}));
