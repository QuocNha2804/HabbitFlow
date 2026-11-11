import { create } from 'zustand';
import { Habit, HabitLog, HabitFilter, HabitStats } from '../types';
import { apiService } from '../services/apiService';
import { notificationService } from '../services/notificationService';
import { formatDateKey, parseDateKey } from '../utils/dateHelpers';
import { calculateOverallStreak } from '../utils/streakCalculator';
import * as Haptics from 'expo-haptics';

interface HabitState {
  habits: Habit[];
  habitLogs: HabitLog[];
  activeDateKey: string;
  filter: HabitFilter;
  isLoading: boolean;

  setActiveDateKey: (dateKey: string) => void;
  setFilter: (filter: HabitFilter) => void;

  loadUserData: (userId: string) => Promise<void>;
  addHabit: (habitData: Omit<Habit, 'id' | 'notificationIds' | 'createdAt' | 'archived'>) => Promise<Habit>;
  updateHabit: (habit: Habit) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;

  toggleHabit: (habitId: string, dateKey?: string) => Promise<void>;
  incrementHabit: (habitId: string, dateKey?: string) => Promise<void>;
  saveNote: (habitId: string, note: string, dateKey?: string) => Promise<void>;

  getScheduledHabitsForDate: (dateKey?: string) => Habit[];
  getHabitLog: (habitId: string, dateKey?: string) => HabitLog | undefined;
  getStats: (userId: string) => HabitStats;

  resetUserData: (userId: string) => Promise<void>;
  importUserData: (userId: string, habits: Habit[], logs: HabitLog[]) => Promise<void>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  habitLogs: [],
  activeDateKey: formatDateKey(),
  filter: 'all',
  isLoading: false,

  setActiveDateKey: (dateKey: string) => set({ activeDateKey: dateKey }),
  setFilter: (filter: HabitFilter) => set({ filter }),

  loadUserData: async (userId: string) => {
    set({ isLoading: true });
    try {
      const [habitsRes, logsRes] = await Promise.all([
        apiService.fetchHabits(userId),
        apiService.fetchLogs(userId),
      ]);
      set({
        habits: habitsRes.data || [],
        habitLogs: logsRes.data || [],
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  addHabit: async (habitData) => {
    const todayKey = formatDateKey();
    const newHabit: Habit = {
      ...habitData,
      id: `hb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: todayKey,
      notificationIds: [],
      archived: false,
    };

    // Lập lịch notification nếu bật
    if (newHabit.reminderEnabled && newHabit.reminderTime) {
      newHabit.notificationIds = await notificationService.scheduleHabitReminder(newHabit);
    }

    await apiService.createHabit(newHabit);
    set((state) => ({ habits: [newHabit, ...state.habits] }));
    return newHabit;
  },

  updateHabit: async (updatedHabit: Habit) => {
    // Hủy notification cũ và tạo lại nếu cần
    await notificationService.cancelHabitReminders(updatedHabit.notificationIds);
    if (updatedHabit.reminderEnabled && updatedHabit.reminderTime) {
      updatedHabit.notificationIds = await notificationService.scheduleHabitReminder(updatedHabit);
    } else {
      updatedHabit.notificationIds = [];
    }

    await apiService.updateHabit(updatedHabit);
    set((state) => ({
      habits: state.habits.map((h) => (h.id === updatedHabit.id ? updatedHabit : h)),
    }));
  },

  deleteHabit: async (habitId: string) => {
    const target = get().habits.find((h) => h.id === habitId);
    if (target?.notificationIds?.length) {
      await notificationService.cancelHabitReminders(target.notificationIds);
    }

    await apiService.deleteHabit(habitId);
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== habitId),
      habitLogs: state.habitLogs.filter((l) => l.habitId !== habitId),
    }));
  },

  toggleHabit: async (habitId: string, dateKey?: string) => {
    const targetDate = dateKey || get().activeDateKey;
    const habit = get().habits.find((h) => h.id === habitId);
    if (!habit) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}

    const existingLog = get().getHabitLog(habitId, targetDate);
    const targetCount = habit.targetCount || 1;

    let newCompleted = false;
    let newCount = 0;

    if (existingLog) {
      newCompleted = !existingLog.completed;
      newCount = newCompleted ? targetCount : 0;
    } else {
      newCompleted = true;
      newCount = targetCount;
    }

    const updatedLog: HabitLog = {
      id: existingLog?.id || `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      habitId,
      userId: habit.userId,
      date: targetDate,
      currentCount: newCount,
      completed: newCompleted,
      note: existingLog?.note,
      updatedAt: new Date().toISOString(),
    };

    await apiService.saveLog(updatedLog);

    set((state) => {
      const idx = state.habitLogs.findIndex((l) => l.id === updatedLog.id || (l.habitId === habitId && l.date === targetDate));
      if (idx >= 0) {
        const copy = [...state.habitLogs];
        copy[idx] = updatedLog;
        return { habitLogs: copy };
      }
      return { habitLogs: [...state.habitLogs, updatedLog] };
    });
  },

  incrementHabit: async (habitId: string, dateKey?: string) => {
    const targetDate = dateKey || get().activeDateKey;
    const habit = get().habits.find((h) => h.id === habitId);
    if (!habit) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    const existingLog = get().getHabitLog(habitId, targetDate);
    const targetCount = habit.targetCount || 1;
    const currentCount = existingLog ? existingLog.currentCount : 0;
    const nextCount = currentCount + 1;
    const isCompleted = nextCount >= targetCount;

    const updatedLog: HabitLog = {
      id: existingLog?.id || `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      habitId,
      userId: habit.userId,
      date: targetDate,
      currentCount: nextCount,
      completed: isCompleted,
      note: existingLog?.note,
      updatedAt: new Date().toISOString(),
    };

    await apiService.saveLog(updatedLog);

    set((state) => {
      const idx = state.habitLogs.findIndex((l) => l.id === updatedLog.id || (l.habitId === habitId && l.date === targetDate));
      if (idx >= 0) {
        const copy = [...state.habitLogs];
        copy[idx] = updatedLog;
        return { habitLogs: copy };
      }
      return { habitLogs: [...state.habitLogs, updatedLog] };
    });
  },

  saveNote: async (habitId: string, note: string, dateKey?: string) => {
    const targetDate = dateKey || get().activeDateKey;
    const habit = get().habits.find((h) => h.id === habitId);
    if (!habit) return;

    const existingLog = get().getHabitLog(habitId, targetDate);
    const updatedLog: HabitLog = {
      id: existingLog?.id || `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      habitId,
      userId: habit.userId,
      date: targetDate,
      currentCount: existingLog ? existingLog.currentCount : 0,
      completed: existingLog ? existingLog.completed : false,
      note: note.trim(),
      updatedAt: new Date().toISOString(),
    };

    await apiService.saveLog(updatedLog);

    set((state) => {
      const idx = state.habitLogs.findIndex((l) => l.id === updatedLog.id || (l.habitId === habitId && l.date === targetDate));
      if (idx >= 0) {
        const copy = [...state.habitLogs];
        copy[idx] = updatedLog;
        return { habitLogs: copy };
      }
      return { habitLogs: [...state.habitLogs, updatedLog] };
    });
  },

  getScheduledHabitsForDate: (dateKey?: string) => {
    const targetKey = dateKey || get().activeDateKey;
    const targetDate = parseDateKey(targetKey);
    const dayOfWeek = targetDate.getDay(); // 0 = CN, 1 = T2, ...

    return get().habits.filter((h) => {
      if (h.archived) return false;
      if (h.frequencyType === 'daily') return true;
      return h.daysOfWeek.includes(dayOfWeek);
    });
  },

  getHabitLog: (habitId: string, dateKey?: string) => {
    const targetKey = dateKey || get().activeDateKey;
    return get().habitLogs.find((l) => l.habitId === habitId && l.date === targetKey);
  },

  getStats: (userId: string): HabitStats => {
    const { habits, habitLogs } = get();
    const userHabits = habits.filter((h) => h.userId === userId);
    const userLogs = habitLogs.filter((l) => l.userId === userId);

    const streakResult = calculateOverallStreak(userHabits, userLogs);
    const completedLogs = userLogs.filter((l) => l.completed);
    const totalCompletions = completedLogs.length;

    // Tính completion rate trên tất cả các ngày có thói quen được phân bổ
    const completionRate = userLogs.length > 0
      ? Math.round((totalCompletions / userLogs.length) * 100)
      : 0;

    return {
      currentStreak: streakResult.currentStreak,
      longestStreak: streakResult.longestStreak,
      totalCompletions,
      completionRate: Math.min(100, Math.max(0, completionRate)),
    };
  },

  resetUserData: async (userId: string) => {
    set({ isLoading: true });
    // Hủy toàn bộ notifications của user
    const userHabits = get().habits.filter((h) => h.userId === userId);
    for (const h of userHabits) {
      if (h.notificationIds?.length) {
        await notificationService.cancelHabitReminders(h.notificationIds);
      }
    }
    await apiService.syncUserData(userId, [], []);
    set((state) => ({
      habits: state.habits.filter((h) => h.userId !== userId),
      habitLogs: state.habitLogs.filter((l) => l.userId !== userId),
      isLoading: false,
    }));
  },

  importUserData: async (userId: string, newHabits: Habit[], newLogs: HabitLog[]) => {
    set({ isLoading: true });
    // Gán userId cho data import
    const sanitizedHabits: Habit[] = newHabits.map((h) => ({
      ...h,
      userId,
      notificationIds: [] as string[],
    }));
    const sanitizedLogs = newLogs.map((l) => ({ ...l, userId }));

    // Tái lập lịch notification
    for (const h of sanitizedHabits) {
      if (h.reminderEnabled && h.reminderTime) {
        h.notificationIds = await notificationService.scheduleHabitReminder(h);
      }
    }

    await apiService.syncUserData(userId, sanitizedHabits, sanitizedLogs);
    set((state) => ({
      habits: [...state.habits.filter((h) => h.userId !== userId), ...sanitizedHabits],
      habitLogs: [...state.habitLogs.filter((l) => l.userId !== userId), ...sanitizedLogs],
      isLoading: false,
    }));
  },
}));
