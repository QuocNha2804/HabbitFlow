import { Habit, HabitLog, User } from '../types';
import { storageService, STORAGE_KEYS } from './storageService';
import { getDemoData } from '../utils/habitTemplates';

// Độ trễ giả lập mạng (ms) để UI có trải nghiệm loading/async tự nhiên
const SIMULATED_LATENCY = 150;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const apiService = {
  // === XÁC THỰC (AUTH API) ===
  async login(email: string, pass: string): Promise<ApiResponse<User>> {
    await delay(SIMULATED_LATENCY);
    const cleanEmail = email.trim().toLowerCase();
    let users = await storageService.getItem<User[]>(STORAGE_KEYS.USERS, []);

    // Hỗ trợ tự động khởi tạo tài khoản Demo nếu người dùng muốn trải nghiệm ngay
    if (cleanEmail === 'demo@habitflow.app' && pass === '123456') {
      let demoUser = users.find((u) => u.email.trim().toLowerCase() === 'demo@habitflow.app');
      if (!demoUser) {
        const demoData = getDemoData();
        demoUser = demoData.user;
        users.push(demoUser);
        await storageService.setItem(STORAGE_KEYS.USERS, users);
        await this.syncUserData(demoUser.id, demoData.habits, demoData.logs);
      }
      await storageService.setItem(STORAGE_KEYS.CURRENT_USER, demoUser);
      return { success: true, data: demoUser };
    }

    const found = users.find(
      (u) => u.email.trim().toLowerCase() === cleanEmail && u.password === pass
    );

    if (found) {
      await storageService.setItem(STORAGE_KEYS.CURRENT_USER, found);
      return { success: true, data: found };
    }
    return { success: false, message: 'Email hoặc mật khẩu không chính xác.' };
  },

  async register(newUser: Omit<User, 'id' | 'createdAt'>): Promise<ApiResponse<User>> {
    await delay(SIMULATED_LATENCY);
    const users = await storageService.getItem<User[]>(STORAGE_KEYS.USERS, []);
    const exists = users.some(
      (u) => u.email.trim().toLowerCase() === newUser.email.trim().toLowerCase()
    );

    if (exists) {
      return { success: false, message: 'Email này đã được đăng ký tài khoản.' };
    }

    const created: User = {
      ...newUser,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    users.push(created);
    await storageService.setItem(STORAGE_KEYS.USERS, users);
    await storageService.setItem(STORAGE_KEYS.CURRENT_USER, created);

    return { success: true, data: created };
  },

  async lookupPassword(email: string): Promise<ApiResponse<string>> {
    await delay(SIMULATED_LATENCY);
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === 'demo@habitflow.app') {
      return { success: true, data: '123456', message: 'Mật khẩu tài khoản demo: 123456' };
    }

    const users = await storageService.getItem<User[]>(STORAGE_KEYS.USERS, []);
    const found = users.find(
      (u) => u.email.trim().toLowerCase() === cleanEmail
    );

    if (found && found.password) {
      return { success: true, data: found.password, message: 'Tìm thấy mật khẩu của bạn.' };
    }
    return { success: false, message: 'Không tìm thấy tài khoản với email này.' };
  },

  // === THÓI QUEN (HABITS API) ===
  async fetchHabits(userId: string): Promise<ApiResponse<Habit[]>> {
    await delay(SIMULATED_LATENCY);
    const allHabits = await storageService.getItem<Habit[]>(STORAGE_KEYS.HABITS, []);
    const userHabits = allHabits.filter((h) => h.userId === userId && !h.archived);
    return { success: true, data: userHabits };
  },

  async createHabit(habit: Habit): Promise<ApiResponse<Habit>> {
    await delay(SIMULATED_LATENCY);
    const allHabits = await storageService.getItem<Habit[]>(STORAGE_KEYS.HABITS, []);
    allHabits.push(habit);
    await storageService.setItem(STORAGE_KEYS.HABITS, allHabits);
    return { success: true, data: habit };
  },

  async updateHabit(updatedHabit: Habit): Promise<ApiResponse<Habit>> {
    await delay(SIMULATED_LATENCY);
    let allHabits = await storageService.getItem<Habit[]>(STORAGE_KEYS.HABITS, []);
    allHabits = allHabits.map((h) => (h.id === updatedHabit.id ? updatedHabit : h));
    await storageService.setItem(STORAGE_KEYS.HABITS, allHabits);
    return { success: true, data: updatedHabit };
  },

  async deleteHabit(habitId: string): Promise<ApiResponse<boolean>> {
    await delay(SIMULATED_LATENCY);
    let allHabits = await storageService.getItem<Habit[]>(STORAGE_KEYS.HABITS, []);
    allHabits = allHabits.filter((h) => h.id !== habitId);
    await storageService.setItem(STORAGE_KEYS.HABITS, allHabits);
    return { success: true, data: true };
  },

  // === NHẬT KÝ CHECK-IN (HABIT LOGS API) ===
  async fetchLogs(userId: string): Promise<ApiResponse<HabitLog[]>> {
    await delay(SIMULATED_LATENCY);
    const allLogs = await storageService.getItem<HabitLog[]>(STORAGE_KEYS.HABIT_LOGS, []);
    const userLogs = allLogs.filter((l) => l.userId === userId);
    return { success: true, data: userLogs };
  },

  async saveLog(log: HabitLog): Promise<ApiResponse<HabitLog>> {
    await delay(SIMULATED_LATENCY);
    let allLogs = await storageService.getItem<HabitLog[]>(STORAGE_KEYS.HABIT_LOGS, []);
    const idx = allLogs.findIndex((l) => l.id === log.id || (l.habitId === log.habitId && l.date === log.date));

    if (idx >= 0) {
      allLogs[idx] = log;
    } else {
      allLogs.push(log);
    }

    await storageService.setItem(STORAGE_KEYS.HABIT_LOGS, allLogs);
    return { success: true, data: log };
  },

  // === ĐỒNG BỘ DỮ LIỆU & IMPORT / EXPORT ===
  async syncUserData(userId: string, habits: Habit[], logs: HabitLog[]): Promise<boolean> {
    try {
      let allHabits = await storageService.getItem<Habit[]>(STORAGE_KEYS.HABITS, []);
      let allLogs = await storageService.getItem<HabitLog[]>(STORAGE_KEYS.HABIT_LOGS, []);

      // Thay thế dữ liệu của user này
      allHabits = allHabits.filter((h) => h.userId !== userId).concat(habits);
      allLogs = allLogs.filter((l) => l.userId !== userId).concat(logs);

      await storageService.setItem(STORAGE_KEYS.HABITS, allHabits);
      await storageService.setItem(STORAGE_KEYS.HABIT_LOGS, allLogs);
      return true;
    } catch {
      return false;
    }
  },
};
