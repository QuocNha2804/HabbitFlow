import {
  format,
  parseISO,
  isToday,
  isTomorrow,
  isYesterday,
  startOfWeek,
  addDays,
  subDays,
  isAfter,
  startOfDay,
  eachDayOfInterval,
  subWeeks,
} from 'date-fns';

export const formatDateKey = (date: Date = new Date()): string => {
  return format(date, 'yyyy-MM-dd');
};

export const parseDateKey = (dateStr: string): Date => {
  return parseISO(dateStr);
};

export const getGreeting = (name?: string): { greeting: string; subGreeting: string } => {
  const hour = new Date().getHours();
  const userName = name ? `, ${name}` : '';

  if (hour >= 5 && hour < 12) {
    return {
      greeting: `Chào buổi sáng${userName} ☀️`,
      subGreeting: 'Bắt đầu ngày mới thật tỉnh táo và đầy năng lượng nhé!',
    };
  } else if (hour >= 12 && hour < 18) {
    return {
      greeting: `Chào buổi chiều${userName} 🌿`,
      subGreeting: 'Giữ vững sự tập trung và duy trì các thói quen tốt!',
    };
  } else {
    return {
      greeting: `Chào buổi tối${userName} 🌙`,
      subGreeting: 'Thời điểm tuyệt vời để thư giãn và tổng kết ngày hôm nay.',
    };
  }
};

export const formatDisplayDate = (dateStr: string): string => {
  const d = parseISO(dateStr);
  if (isToday(d)) return 'Hôm nay';
  if (isTomorrow(d)) return 'Ngày mai';
  if (isYesterday(d)) return 'Hôm qua';

  const dayNames = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
  const dayName = dayNames[d.getDay()];
  return `${dayName}, ${format(d, 'dd/MM')}`;
};

export const formatHeaderDate = (date: Date = new Date()): string => {
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = dayNames[date.getDay()];
  return `${dayName}, ${format(date, 'dd/MM/yyyy')}`;
};

export const getWeekDays = (referenceDate: Date = new Date()): { date: Date; dateKey: string; dayLabel: string; dayNumber: number }[] => {
  // Bắt đầu từ Thứ Hai (weekStartsOn: 1)
  const monday = startOfWeek(referenceDate, { weekStartsOn: 1 });
  const dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i);
    return {
      date: d,
      dateKey: formatDateKey(d),
      dayLabel: dayLabels[i],
      dayNumber: d.getDate(),
    };
  });
};

export const getLastNDays = (n: number = 7, endDate: Date = new Date()): string[] => {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    dates.push(formatDateKey(subDays(endDate, i)));
  }
  return dates;
};

export const getHeatmapDays = (weeks: number = 12): string[] => {
  const end = startOfDay(new Date());
  const start = subWeeks(end, weeks);
  return eachDayOfInterval({ start, end }).map((d) => formatDateKey(d));
};

export const isFutureDate = (dateStr: string): boolean => {
  const target = startOfDay(parseISO(dateStr));
  const today = startOfDay(new Date());
  return isAfter(target, today);
};

export const getMotivationalQuote = (rate: number): string => {
  if (rate === 100) return 'Xuất sắc! Bạn đã hoàn thành trọn vẹn mục tiêu hôm nay 🎉';
  if (rate >= 75) return 'Gần về đích rồi, thêm một chút kiên trì nữa thôi! 💪';
  if (rate >= 50) return 'Bạn đã đi được một nửa chặng đường hôm nay rồi 🌱';
  if (rate > 0) return 'Khởi đầu tốt! Từng bước nhỏ tạo nên thay đổi lớn 🌿';
  return 'Hãy bắt đầu thói quen đầu tiên để tạo đà năng suất nhé ✨';
};
