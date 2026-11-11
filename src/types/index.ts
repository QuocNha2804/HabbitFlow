export type FrequencyType = 'daily' | 'custom_days';

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  icon: string;
  color: string;
  frequencyType: FrequencyType;
  daysOfWeek: number[]; // 0 = Chủ nhật, 1 = Thứ 2, ..., 6 = Thứ 7
  targetCount: number;  // Số lần/ngày, ví dụ: 1 hoặc 8 cốc nước
  unit?: string;        // 'lần', 'cốc', 'phút', 'trang'
  reminderTime?: string; // '07:30'
  reminderEnabled: boolean;
  notificationIds: string[];
  createdAt: string;    // 'YYYY-MM-DD'
  archived: boolean;
}

export interface HabitLog {
  id: string;
  habitId: string;
  userId: string;
  date: string;         // 'YYYY-MM-DD'
  currentCount: number; // Đã làm mấy lần trong ngày
  completed: boolean;   // true khi currentCount >= targetCount
  note?: string;        // Ghi chú nhật ký trong ngày
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  avatarUri?: string;
  defaultReminderTime: string; // '08:00'
  selectedGoal?: string;       // 'health' | 'learning' | 'meditation' | 'productivity'
  createdAt: string;
}

export interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate: number; // 0 - 100%
}

export type HabitFilter = 'all' | 'pending' | 'completed';
