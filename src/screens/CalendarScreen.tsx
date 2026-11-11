import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';
import { useHabitStore } from '../store/useHabitStore';
import { NoteModal } from '../components/NoteModal';
import { formatDateKey, formatDisplayDate, isFutureDate } from '../utils/dateHelpers';
import { Habit } from '../types';
import { borderRadius, shadow, spacing, typography } from '../theme';

// Cấu hình tiếng Việt cho Calendar
LocaleConfig.locales['vi'] = {
  monthNames: [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ],
  monthNamesShort: ['Thg 1', 'Thg 2', 'Thg 3', 'Thg 4', 'Thg 5', 'Thg 6', 'Thg 7', 'Thg 8', 'Thg 9', 'Thg 10', 'Thg 11', 'Thg 12'],
  dayNames: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay',
};
LocaleConfig.defaultLocale = 'vi';

export const CalendarScreen: React.FC = () => {
  const { colors, isDarkMode } = useThemeStore();
  const {
    habits,
    habitLogs,
    getScheduledHabitsForDate,
    getHabitLog,
    toggleHabit,
    saveNote,
  } = useHabitStore();

  const [selectedDate, setSelectedDate] = useState<string>(formatDateKey());
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [selectedHabitForNote, setSelectedHabitForNote] = useState<Habit | null>(null);

  // Tạo markedDates cho Calendar
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    // Đánh dấu ngày có thói quen hoàn thành
    habitLogs.forEach((log) => {
      if (log.completed) {
        marks[log.date] = {
          marked: true,
          dotColor: colors.primary,
        };
      }
    });

    // Đánh dấu ngày đang chọn
    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: colors.primary,
      selectedTextColor: '#FFFFFF',
    };

    return marks;
  }, [habitLogs, selectedDate, colors.primary]);

  // Thói quen có lịch vào ngày đang chọn
  const habitsForSelectedDate = useMemo(() => {
    return getScheduledHabitsForDate(selectedDate);
  }, [habits, selectedDate]);

  const completedCount = useMemo(() => {
    return habitsForSelectedDate.filter((h) => {
      const log = getHabitLog(h.id, selectedDate);
      return log?.completed;
    }).length;
  }, [habitsForSelectedDate, habitLogs, selectedDate]);

  const handleToggle = (habitId: string) => {
    if (isFutureDate(selectedDate)) {
      Alert.alert('Chưa đến ngày', 'Bạn không thể hoàn thành trước cho những ngày trong tương lai.');
      return;
    }
    toggleHabit(habitId, selectedDate);
  };

  const handleOpenNote = (habit: Habit) => {
    setSelectedHabitForNote(habit);
    setNoteModalVisible(true);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Lịch thói quen 📅</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Theo dõi nhật ký các ngày và hỗ trợ bù lịch nếu bạn lỡ quên.
          </Text>
        </View>

        {/* Calendar Card */}
        <View
          style={[
            styles.calendarCard,
            { backgroundColor: colors.card, borderColor: colors.border },
            shadow.card,
          ]}
        >
          <Calendar
            current={selectedDate}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={{
              backgroundColor: colors.card,
              calendarBackground: colors.card,
              textSectionTitleColor: colors.textSecondary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: '#ffffff',
              todayTextColor: colors.primary,
              dayTextColor: colors.text,
              textDisabledColor: colors.textMuted,
              dotColor: colors.primary,
              selectedDotColor: '#ffffff',
              arrowColor: colors.primary,
              monthTextColor: colors.text,
              indicatorColor: colors.primary,
              textDayFontWeight: '600',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
            }}
          />
        </View>

        {/* Selected Date Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailsHeader}>
            <View>
              <Text style={[styles.selectedDateTitle, { color: colors.text }]}>
                {formatDisplayDate(selectedDate)}
              </Text>
              <Text style={[styles.selectedDateSub, { color: colors.textSecondary }]}>
                Đã hoàn thành {completedCount} / {habitsForSelectedDate.length} thói quen
              </Text>
            </View>

            {isFutureDate(selectedDate) && (
              <View style={[styles.futureBadge, { backgroundColor: colors.surfaceSubtle }]}>
                <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
                <Text style={[styles.futureText, { color: colors.textSecondary }]}>Tương lai</Text>
              </View>
            )}
          </View>

          {/* List of habits for this day */}
          <View style={styles.habitsList}>
            {habitsForSelectedDate.map((habit) => {
              const log = getHabitLog(habit.id, selectedDate);
              const isCompleted = log?.completed || false;

              return (
                <View
                  key={habit.id}
                  style={[
                    styles.habitRow,
                    {
                      backgroundColor: colors.card,
                      borderColor: isCompleted ? colors.primarySoft : colors.border,
                    },
                    isCompleted && { backgroundColor: colors.surfaceSubtle },
                    shadow.soft,
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.iconCircle,
                      { backgroundColor: habit.color ? `${habit.color}18` : colors.primaryLight },
                    ]}
                  >
                    <Ionicons
                      name={(habit.icon as any) || 'leaf-outline'}
                      size={20}
                      color={habit.color || colors.primary}
                    />
                  </TouchableOpacity>

                  <View style={styles.habitInfo}>
                    <Text
                      style={[
                        styles.habitTitle,
                        { color: colors.text },
                        isCompleted && styles.completedTitle,
                      ]}
                      numberOfLines={1}
                    >
                      {habit.title}
                    </Text>

                    {log?.note ? (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleOpenNote(habit)}
                        style={styles.notePreview}
                      >
                        <Ionicons name="document-text-outline" size={11} color={colors.primary} />
                        <Text
                          style={[styles.notePreviewText, { color: colors.primary }]}
                          numberOfLines={1}
                        >
                          {log.note}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleOpenNote(habit)}
                        style={styles.addNoteBtn}
                      >
                        <Text style={[styles.addNoteText, { color: colors.textMuted }]}>
                          + Viết ghi chú
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Tick Checkbox */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleToggle(habit.id)}
                    style={[
                      styles.checkbox,
                      {
                        borderColor: isCompleted ? colors.primary : colors.borderFocus,
                        backgroundColor: isCompleted ? colors.primary : 'transparent',
                      },
                    ]}
                  >
                    {isCompleted && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                  </TouchableOpacity>
                </View>
              );
            })}

            {habitsForSelectedDate.length === 0 && (
              <View
                style={[
                  styles.emptyDayCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <Ionicons name="sunny-outline" size={32} color={colors.primary} />
                <Text style={[styles.emptyDayText, { color: colors.textSecondary }]}>
                  Không có thói quen nào được lên lịch cho ngày này.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Note Modal */}
      {selectedHabitForNote && (
        <NoteModal
          visible={noteModalVisible}
          habitTitle={selectedHabitForNote.title}
          initialNote={getHabitLog(selectedHabitForNote.id, selectedDate)?.note}
          onClose={() => setNoteModalVisible(false)}
          onSave={(noteText) => saveNote(selectedHabitForNote.id, noteText, selectedDate)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.h2,
    fontSize: 22,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.bodySmall,
  },
  calendarCard: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    paddingBottom: spacing.sm,
  },
  detailsSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  selectedDateTitle: {
    ...typography.h3,
    fontSize: 17,
    fontWeight: '700',
  },
  selectedDateSub: {
    ...typography.caption,
    fontSize: 12,
    marginTop: 2,
  },
  futureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  futureText: {
    fontSize: 11,
    fontWeight: '600',
  },
  habitsList: {
    gap: spacing.sm,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  habitInfo: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  habitTitle: {
    ...typography.label,
    fontSize: 14,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.65,
  },
  notePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  notePreviewText: {
    fontSize: 11,
    fontWeight: '600',
  },
  addNoteBtn: {
    marginTop: 2,
  },
  addNoteText: {
    fontSize: 11,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDayCard: {
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  emptyDayText: {
    ...typography.bodySmall,
    textAlign: 'center',
  },
});
