import { Habit, HabitLog, User } from '../types';
import { formatDateKey } from './dateHelpers';
import { subDays } from 'date-fns';

export interface StarterGoal {
  id: string;
  title: string;
  icon: string;
  description: string;
  templates: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'notificationIds' | 'archived'>[];
}

export const STARTER_GOALS: StarterGoal[] = [
  {
    id: 'health',
    title: 'Sức khỏe & Vóc dáng',
    icon: 'fitness-outline',
    description: 'Rèn luyện thể lực, uống đủ nước và ngủ đúng giờ',
    templates: [
      {
        title: 'Uống 8 cốc nước',
        description: 'Bổ sung nước đều đặn mỗi ngày',
        icon: 'water-outline',
        color: '#3B82F6',
        frequencyType: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        targetCount: 8,
        unit: 'cốc',
        reminderTime: '08:00',
        reminderEnabled: true,
      },
      {
        title: 'Đi bộ hoặc Chạy bộ 30 phút',
        description: 'Vận động thể chất nhẹ nhàng',
        icon: 'walk-outline',
        color: '#5DB075',
        frequencyType: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        targetCount: 1,
        unit: 'lần',
        reminderTime: '17:30',
        reminderEnabled: true,
      },
      {
        title: 'Đi ngủ trước 23h00',
        description: 'Ngủ đủ giấc để phục hồi năng lượng',
        icon: 'bed-outline',
        color: '#8B5CF6',
        frequencyType: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        targetCount: 1,
        unit: 'lần',
        reminderTime: '22:30',
        reminderEnabled: true,
      },
    ],
  },
  {
    id: 'learning',
    title: 'Học tập & Phát triển',
    icon: 'book-outline',
    description: 'Nâng cao kỹ năng, đọc sách và tích lũy tri thức',
    templates: [
      {
        title: 'Đọc 15 trang sách',
        description: 'Nuôi dưỡng thói quen đọc mỗi ngày',
        icon: 'book-outline',
        color: '#5DB075',
        frequencyType: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        targetCount: 15,
        unit: 'trang',
        reminderTime: '20:30',
        reminderEnabled: true,
      },
      {
        title: 'Học 10 từ vựng mới',
        description: 'Mở rộng vốn ngôn ngữ',
        icon: 'bulb-outline',
        color: '#F59E0B',
        frequencyType: 'daily',
        daysOfWeek: [1, 2, 3, 4, 5],
        targetCount: 10,
        unit: 'từ',
        reminderTime: '09:00',
        reminderEnabled: true,
      },
    ],
  },
  {
    id: 'meditation',
    title: 'Thiền & Tâm trí',
    icon: 'leaf-outline',
    description: 'Giảm stress, giữ tâm an yên và chánh niệm',
    templates: [
      {
        title: 'Thiền 10 phút buổi sáng',
        description: 'Hít thở sâu và thanh lọc tâm trí',
        icon: 'leaf-outline',
        color: '#4E9F8E',
        frequencyType: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        targetCount: 1,
        unit: 'lần',
        reminderTime: '06:30',
        reminderEnabled: true,
      },
      {
        title: 'Viết 3 điều biết ơn',
        description: 'Ghi lại những điều tích cực trong ngày',
        icon: 'pencil-outline',
        color: '#EC4899',
        frequencyType: 'daily',
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        targetCount: 1,
        unit: 'lần',
        reminderTime: '21:30',
        reminderEnabled: true,
      },
    ],
  },
  {
    id: 'productivity',
    title: 'Năng suất & Công việc',
    icon: 'timer-outline',
    description: 'Lập kế hoạch, tập trung sâu và hoàn thành mục tiêu',
    templates: [
      {
        title: 'Lập to-do list đầu ngày',
        description: 'Xác định 3 việc quan trọng nhất',
        icon: 'pencil-outline',
        color: '#5DB075',
        frequencyType: 'daily',
        daysOfWeek: [1, 2, 3, 4, 5],
        targetCount: 1,
        unit: 'lần',
        reminderTime: '08:00',
        reminderEnabled: true,
      },
      {
        title: 'Hoàn thành 4 phiên Pomodoro',
        description: 'Tập trung sâu không xao nhãng',
        icon: 'timer-outline',
        color: '#EF4444',
        frequencyType: 'daily',
        daysOfWeek: [1, 2, 3, 4, 5],
        targetCount: 4,
        unit: 'phiên',
        reminderTime: '10:00',
        reminderEnabled: false,
      },
    ],
  },
];

export const generateStarterHabits = (goalId: string, userId: string): Habit[] => {
  const goal = STARTER_GOALS.find((g) => g.id === goalId) || STARTER_GOALS[0];
  const todayKey = formatDateKey();

  return goal.templates.map((tpl, index) => ({
    ...tpl,
    id: `starter_${Date.now()}_${index}`,
    userId,
    createdAt: todayKey,
    notificationIds: [],
    archived: false,
  }));
};

/**
 * Khởi tạo dữ liệu mẫu tài khoản Demo (demo@habitflow.app / 123456)
 */
export const getDemoData = (): {
  user: User;
  habits: Habit[];
  logs: HabitLog[];
} => {
  const userId = 'usr_demo_001';
  const now = new Date();
  const createdDate = formatDateKey(subDays(now, 30));

  const user: User = {
    id: userId,
    email: 'demo@habitflow.app',
    name: 'Quốc Nam',
    password: '123456',
    defaultReminderTime: '08:00',
    selectedGoal: 'health',
    createdAt: createdDate,
  };

  const habits: Habit[] = [
    {
      id: 'demo_hb_1',
      userId,
      title: 'Uống 8 cốc nước',
      description: 'Cung cấp đủ nước cho cơ thể thanh lọc mỗi ngày',
      icon: 'water-outline',
      color: '#3B82F6',
      frequencyType: 'daily',
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      targetCount: 8,
      unit: 'cốc',
      reminderTime: '08:30',
      reminderEnabled: true,
      notificationIds: [],
      createdAt: createdDate,
      archived: false,
    },
    {
      id: 'demo_hb_2',
      userId,
      title: 'Chạy bộ 30 phút',
      description: 'Rèn luyện sức bền tim mạch và đốt calo',
      icon: 'fitness-outline',
      color: '#5DB075',
      frequencyType: 'daily',
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      targetCount: 1,
      unit: 'lần',
      reminderTime: '17:30',
      reminderEnabled: true,
      notificationIds: [],
      createdAt: createdDate,
      archived: false,
    },
    {
      id: 'demo_hb_3',
      userId,
      title: 'Đọc 15 trang sách',
      description: 'Phát triển bản thân qua từng trang sách hay',
      icon: 'book-outline',
      color: '#8B5CF6',
      frequencyType: 'daily',
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      targetCount: 15,
      unit: 'trang',
      reminderTime: '21:00',
      reminderEnabled: true,
      notificationIds: [],
      createdAt: createdDate,
      archived: false,
    },
    {
      id: 'demo_hb_4',
      userId,
      title: 'Thiền 10 phút sáng',
      description: 'Giữ tâm trí tĩnh lặng và tập trung sâu',
      icon: 'leaf-outline',
      color: '#4E9F8E',
      frequencyType: 'custom_days',
      daysOfWeek: [1, 2, 3, 4, 5],
      targetCount: 1,
      unit: 'lần',
      reminderTime: '06:30',
      reminderEnabled: true,
      notificationIds: [],
      createdAt: createdDate,
      archived: false,
    },
    {
      id: 'demo_hb_5',
      userId,
      title: 'Đi ngủ trước 23h00',
      description: 'Tránh thức khuya để sáng dậy tràn đầy năng lượng',
      icon: 'bed-outline',
      color: '#EC4899',
      frequencyType: 'daily',
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      targetCount: 1,
      unit: 'lần',
      reminderTime: '22:30',
      reminderEnabled: true,
      notificationIds: [],
      createdAt: createdDate,
      archived: false,
    },
  ];

  // Sinh log hoàn thành cho 21 ngày gần nhất để biểu đồ và heatmap rực rỡ
  const logs: HabitLog[] = [];
  const sampleNotes = [
    'Hôm nay chạy được 4.5km quanh công viên, rất sảng khoái! 🌿',
    'Đọc xong chương 3 về thói quen nguyên tử, tâm đắc phương pháp xếp chồng thói quen.',
    'Thiền sáng 10 phút giúp đầu óc cực kỳ minh mẫn ✨',
    'Uống đủ nước cảm thấy cơ thể nhẹ nhõm hơn hẳn.',
    'Ngủ đúng giờ sáng dậy tỉnh táo không bị uể oải.',
  ];

  for (let i = 21; i >= 0; i--) {
    const d = subDays(now, i);
    const dateKey = formatDateKey(d);
    const isToday = i === 0;

    habits.forEach((habit, hIdx) => {
      // Xác định ngày có lịch
      const dayOfWeek = d.getDay();
      const isScheduled =
        habit.frequencyType === 'daily' || habit.daysOfWeek.includes(dayOfWeek);

      if (!isScheduled) return;

      // Với ngày hôm nay: hoàn thành 3 thói quen đầu để còn lại 2 cái cho user test tương tác
      let isCompleted = false;
      let count = 0;
      let note: string | undefined = undefined;

      if (isToday) {
        if (hIdx === 0) {
          count = 6; // Uống nước 6/8
          isCompleted = false;
        } else if (hIdx === 1) {
          count = 1;
          isCompleted = true;
          note = sampleNotes[0];
        } else if (hIdx === 3) {
          count = 1;
          isCompleted = true;
          note = sampleNotes[2];
        }
      } else {
        // Các ngày trong quá khứ: tỉ lệ hoàn thành ~80% để tạo chuỗi streak đẹp
        const rand = (i * 7 + hIdx * 13) % 10;
        isCompleted = rand >= 2;
        count = isCompleted ? habit.targetCount : Math.floor(habit.targetCount / 2);
        if (isCompleted && rand >= 7) {
          note = sampleNotes[hIdx % sampleNotes.length];
        }
      }

      if (count > 0 || isCompleted || note) {
        logs.push({
          id: `log_demo_${dateKey}_${habit.id}`,
          habitId: habit.id,
          userId,
          date: dateKey,
          currentCount: count,
          completed: isCompleted,
          note,
          updatedAt: new Date().toISOString(),
        });
      }
    });
  }

  return { user, habits, logs };
};
