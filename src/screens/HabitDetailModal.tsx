import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useThemeStore } from '../store/useThemeStore';
import { useHabitStore } from '../store/useHabitStore';
import { calculateHabitStreak } from '../utils/streakCalculator';
import { CustomButton } from '../components/CustomButton';
import { formatDisplayDate } from '../utils/dateHelpers';
import { borderRadius, shadow, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'HabitDetailModal'>;

export const HabitDetailModal: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useThemeStore();
  const { habits, habitLogs, deleteHabit } = useHabitStore();
  const { habitId } = route.params;

  const habit = useMemo(() => habits.find((h) => h.id === habitId), [habits, habitId]);

  if (!habit) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: colors.textSecondary }]}>
            Không tìm thấy thói quen này.
          </Text>
          <CustomButton title="Đóng" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  // Lọc nhật ký và streak riêng của thói quen
  const streakInfo = calculateHabitStreak(habit, habitLogs);
  const thisHabitLogs = habitLogs.filter((l) => l.habitId === habit.id);
  const completedLogs = thisHabitLogs.filter((l) => l.completed);
  const notesWithDate = thisHabitLogs.filter((l) => l.note && l.note.trim().length > 0);

  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa thói quen "${habit.title}" không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await deleteHabit(habit.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    navigation.replace('AddHabitModal', { mode: 'edit', habit });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.headerBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Chi tiết thói quen</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.editBtn}>
          <Ionicons name="create-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner thói quen */}
        <View
          style={[
            styles.bannerCard,
            { backgroundColor: colors.card, borderColor: colors.border },
            shadow.card,
          ]}
        >
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: habit.color ? `${habit.color}22` : colors.primaryLight },
            ]}
          >
            <Ionicons
              name={(habit.icon as any) || 'leaf-outline'}
              size={36}
              color={habit.color || colors.primary}
            />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{habit.title}</Text>
          {habit.description ? (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {habit.description}
            </Text>
          ) : null}

          {/* Tag tần suất */}
          <View style={[styles.freqTag, { backgroundColor: colors.surfaceSubtle }]}>
            <Ionicons name="calendar-outline" size={13} color={colors.primary} />
            <Text style={[styles.freqText, { color: colors.primaryDark }]}>
              {habit.frequencyType === 'daily'
                ? 'Hàng ngày'
                : `Thứ trong tuần: ${habit.daysOfWeek.map((d) => (d === 0 ? 'CN' : `T${d + 1}`)).join(', ')}`}
            </Text>
          </View>
        </View>

        {/* 4 Chỉ số KPI riêng của thói quen */}
        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.border }, shadow.soft]}>
            <Text style={styles.kpiEmoji}>🔥</Text>
            <Text style={[styles.kpiValue, { color: colors.text }]}>{streakInfo.currentStreak}</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Streak hiện tại</Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.border }, shadow.soft]}>
            <Text style={styles.kpiEmoji}>🏆</Text>
            <Text style={[styles.kpiValue, { color: colors.text }]}>{streakInfo.longestStreak}</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Kỷ lục dài nhất</Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.border }, shadow.soft]}>
            <Text style={styles.kpiEmoji}>✅</Text>
            <Text style={[styles.kpiValue, { color: colors.text }]}>{completedLogs.length}</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Tổng ngày xong</Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.border }, shadow.soft]}>
            <Text style={styles.kpiEmoji}>🎯</Text>
            <Text style={[styles.kpiValue, { color: colors.text }]}>
              {habit.targetCount} {habit.unit || 'lần'}
            </Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Mục tiêu/ngày</Text>
          </View>
        </View>

        {/* Nhật ký ghi chú của riêng thói quen này */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Nhật ký & Ghi chú ({notesWithDate.length})
          </Text>
        </View>

        {notesWithDate.length > 0 ? (
          <View style={styles.notesList}>
            {notesWithDate.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.noteCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  shadow.soft,
                ]}
              >
                <View style={styles.noteTopRow}>
                  <Text style={[styles.noteDate, { color: colors.primary }]}>
                    {formatDisplayDate(item.date)}
                  </Text>
                  {item.completed && (
                    <View style={[styles.noteDoneBadge, { backgroundColor: colors.primaryLight }]}>
                      <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                      <Text style={[styles.noteDoneText, { color: colors.primaryDark }]}>Đã xong</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.noteContent, { color: colors.text }]}>{item.note}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={[styles.emptyNotes, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="pencil-outline" size={28} color={colors.textMuted} />
            <Text style={[styles.emptyNotesText, { color: colors.textSecondary }]}>
              Chưa có ghi chú nào. Khi tick thói quen ở trang chủ, bạn có thể bấm vào biểu tượng cây bút để viết nhật ký.
            </Text>
          </View>
        )}

        {/* Delete Habit Button */}
        <CustomButton
          title="Xóa thói quen này"
          variant="danger"
          icon="trash-outline"
          onPress={handleDelete}
          style={styles.deleteBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  closeBtn: {
    padding: 6,
  },
  headerTitle: {
    ...typography.h3,
    fontSize: 17,
  },
  editBtn: {
    padding: 6,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 60,
  },
  bannerCard: {
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body,
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: spacing.md,
  },
  freqTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    gap: 6,
  },
  freqText: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  kpiEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  kpiValue: {
    ...typography.h3,
    fontSize: 18,
    fontWeight: '800',
  },
  kpiLabel: {
    ...typography.caption,
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.label,
    fontSize: 16,
  },
  notesList: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  noteCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  noteTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  noteDate: {
    ...typography.caption,
    fontWeight: '700',
  },
  noteDoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  noteDoneText: {
    fontSize: 10,
    fontWeight: '700',
  },
  noteContent: {
    ...typography.body,
    fontSize: 13,
    lineHeight: 18,
  },
  emptyNotes: {
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emptyNotesText: {
    ...typography.bodySmall,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 18,
    maxWidth: 280,
  },
  deleteBtn: {
    marginTop: spacing.md,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  notFoundText: {
    ...typography.body,
    marginBottom: spacing.lg,
  },
});
