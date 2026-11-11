import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Habit } from '../types';

// Cấu hình notification handler
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (e) {
  console.log('[Notifications] Handler set error:', e);
}

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      return finalStatus === 'granted';
    } catch (error) {
      console.warn('[Notifications] Error requesting permission:', error);
      return false;
    }
  },

  async scheduleHabitReminder(habit: Habit): Promise<string[]> {
    if (Platform.OS === 'web' || !habit.reminderEnabled || !habit.reminderTime) {
      return [];
    }

    const scheduledIds: string[] = [];
    try {
      const [hourStr, minuteStr] = habit.reminderTime.split(':');
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);

      if (isNaN(hour) || isNaN(minute)) return [];

      // Nếu là hàng ngày
      if (habit.frequencyType === 'daily') {
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: `HabitFlow: Đến giờ rồi! 🌿`,
            body: `Đã đến giờ thực hiện: "${habit.title}". Hãy dành ít phút ngay nhé!`,
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
          },
        });
        scheduledIds.push(id);
      } else {
        // Từng thứ trong tuần (daysOfWeek: 0 = CN, 1 = T2, ...)
        for (const weekday of habit.daysOfWeek) {
          // Expo Notification weekday: 1 = Sunday, 2 = Monday, ..., 7 = Saturday
          const expoWeekday = weekday === 0 ? 1 : weekday + 1;
          const id = await Notifications.scheduleNotificationAsync({
            content: {
              title: `HabitFlow: Nhắc nhở hôm nay 🌿`,
              body: `Hôm nay có lịch thực hiện: "${habit.title}". Cùng duy trì chuỗi nào!`,
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
              weekday: expoWeekday,
              hour,
              minute,
            },
          });
          scheduledIds.push(id);
        }
      }
    } catch (error) {
      console.warn('[Notifications] Schedule habit reminder error:', error);
    }

    return scheduledIds;
  },

  async cancelHabitReminders(notificationIds: string[] = []): Promise<void> {
    if (Platform.OS === 'web' || !notificationIds.length) return;
    try {
      for (const id of notificationIds) {
        await Notifications.cancelScheduledNotificationAsync(id);
      }
    } catch (error) {
      console.warn('[Notifications] Cancel reminders error:', error);
    }
  },

  async scheduleDailySummary(hour: number = 21, minute: number = 0): Promise<string | null> {
    if (Platform.OS === 'web') return null;
    try {
      return await Notifications.scheduleNotificationAsync({
        content: {
          title: 'HabitFlow: Tổng kết ngày hôm nay ✨',
          body: 'Bạn đã hoàn thành đủ các thói quen hôm nay chưa? Mở app kiểm tra và lưu giữ chuỗi streak nhé!',
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
    } catch (error) {
      console.warn('[Notifications] Schedule daily summary error:', error);
      return null;
    }
  },
};
