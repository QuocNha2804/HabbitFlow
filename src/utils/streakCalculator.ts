import { Habit, HabitLog } from '../types';
import { formatDateKey } from './dateHelpers';
import { parseISO, subDays, startOfDay, isBefore } from 'date-fns';

export interface HabitStreakResult {
  currentStreak: number;
  longestStreak: number;
}

/**
 * Tính streak cho một thói quen cụ thể theo lịch phân bổ (daysOfWeek)
 */
export const calculateHabitStreak = (
  habit: Habit,
  logs: HabitLog[],
  todayKey: string = formatDateKey()
): HabitStreakResult => {
  // Lọc log hoàn thành của riêng thói quen này
  const completedLogDates = new Set(
    logs
      .filter((l) => l.habitId === habit.id && l.completed)
      .map((l) => l.date)
  );

  const createdAtDate = startOfDay(parseISO(habit.createdAt || todayKey));
  const todayDate = startOfDay(parseISO(todayKey));

  // Hàm kiểm tra 1 ngày cụ thể có nằm trong lịch của thói quen không
  const isScheduledDay = (d: Date): boolean => {
    if (habit.frequencyType === 'daily') return true;
    return habit.daysOfWeek.includes(d.getDay());
  };

  // 1. Tính current streak
  let currentStreak = 0;
  let cursor = todayDate;

  // Nếu hôm nay có lịch và đã hoàn thành -> tính hôm nay vào streak
  // Nếu hôm nay có lịch nhưng chưa xong -> bắt đầu kiểm tra lùi từ hôm qua
  if (isScheduledDay(todayDate) && completedLogDates.has(todayKey)) {
    currentStreak++;
    cursor = subDays(todayDate, 1);
  } else {
    cursor = subDays(todayDate, 1);
  }

  // Quét ngược về quá khứ cho đến ngày tạo
  while (!isBefore(cursor, createdAtDate)) {
    if (isScheduledDay(cursor)) {
      const key = formatDateKey(cursor);
      if (completedLogDates.has(key)) {
        currentStreak++;
      } else {
        // Gặp 1 ngày có lịch mà bị bỏ lỡ -> đứt streak
        break;
      }
    }
    // Nếu ngày này không có lịch (ví dụ T3 với habit T2, T4, T6) thì bỏ qua không làm đứt chuỗi
    cursor = subDays(cursor, 1);
  }

  // 2. Tính longest streak trong lịch sử
  let longestStreak = currentStreak;
  let tempStreak = 0;
  let scanCursor = createdAtDate;

  while (!isBefore(todayDate, scanCursor)) {
    if (isScheduledDay(scanCursor)) {
      const key = formatDateKey(scanCursor);
      if (completedLogDates.has(key)) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    }
    scanCursor = parseISO(formatDateKey(subDays(scanCursor, -1))); // tăng 1 ngày
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
  };
};

/**
 * Tính streak tổng quan của người dùng (tất cả thói quen)
 */
export const calculateOverallStreak = (
  habits: Habit[],
  logs: HabitLog[],
  todayKey: string = formatDateKey()
): HabitStreakResult => {
  if (habits.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Bản đồ thống kê số lượng thói quen xong theo từng ngày
  const completedCountByDate: Record<string, number> = {};
  logs.forEach((l) => {
    if (l.completed) {
      completedCountByDate[l.date] = (completedCountByDate[l.date] || 0) + 1;
    }
  });

  let currentStreak = 0;
  let cursor = startOfDay(parseISO(todayKey));

  if ((completedCountByDate[todayKey] || 0) > 0) {
    currentStreak++;
    cursor = subDays(cursor, 1);
  } else {
    cursor = subDays(cursor, 1);
  }

  // Quét lùi tối đa 365 ngày
  for (let i = 0; i < 365; i++) {
    const key = formatDateKey(cursor);
    if ((completedCountByDate[key] || 0) > 0) {
      currentStreak++;
      cursor = subDays(cursor, 1);
    } else {
      break;
    }
  }

  // Tìm longest streak trong 365 ngày
  let longestStreak = currentStreak;
  let tempStreak = 0;
  let checkDate = subDays(startOfDay(parseISO(todayKey)), 365);

  for (let i = 0; i <= 365; i++) {
    const key = formatDateKey(checkDate);
    if ((completedCountByDate[key] || 0) > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
    checkDate = subDays(checkDate, -1);
  }

  return {
    currentStreak,
    longestStreak,
  };
};
