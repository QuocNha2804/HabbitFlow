import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Habit, HabitLog } from '../types';
import { useThemeStore } from '../store/useThemeStore';
import { calculateHabitStreak } from '../utils/streakCalculator';
import { borderRadius, shadow, spacing, typography } from '../theme';

interface HabitCardProps {
  habit: Habit;
  log?: HabitLog;
  allLogs: HabitLog[];
  dateKey: string;
  onToggle: () => void;
  onIncrement: () => void;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddNote: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  log,
  allLogs,
  dateKey,
  onToggle,
  onIncrement,
  onPress,
  onEdit,
  onDelete,
  onAddNote,
}) => {
  const { colors } = useThemeStore();
  const swipeableRef = useRef<SwipeableMethods>(null);

  const isCompleted = log?.completed || false;
  const currentCount = log?.currentCount || 0;
  const targetCount = habit.targetCount || 1;
  const hasMultipleTargets = targetCount > 1;

  // Tính chuỗi streak cho riêng habit này
  const streakInfo = calculateHabitStreak(habit, allLogs, dateKey);

  // Render Swipe Actions
  const renderRightActions = (
    _progress: any,
    _translation: any,
    swipeableMethods: SwipeableMethods
  ) => {
    return (
      <View style={styles.rightActionsContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.actionButton, { backgroundColor: colors.danger }]}
          onPress={() => {
            swipeableMethods.close();
            onDelete();
          }}
        >
          <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
          <Text style={styles.actionText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLeftActions = (
    _progress: any,
    _translation: any,
    swipeableMethods: SwipeableMethods
  ) => {
    return (
      <View style={styles.leftActionsContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => {
            swipeableMethods.close();
            onEdit();
          }}
        >
          <Ionicons name="create-outline" size={22} color="#FFFFFF" />
          <Text style={styles.actionText}>Sửa</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.cardWrapper}>
      <ReanimatedSwipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        friction={2}
        rightThreshold={40}
        leftThreshold={40}
      >
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={onPress}
          style={[
            styles.container,
            {
              backgroundColor: colors.card,
              borderColor: isCompleted ? colors.primarySoft : colors.border,
            },
            isCompleted && { backgroundColor: colors.surfaceSubtle },
            shadow.soft,
          ]}
        >
          {/* Cột trái: Icon */}
          <View
            style={[
              styles.iconWrapper,
              {
                backgroundColor: habit.color ? `${habit.color}18` : colors.primaryLight,
              },
            ]}
          >
            <Ionicons
              name={(habit.icon as any) || 'leaf-outline'}
              size={24}
              color={habit.color || colors.primary}
            />
          </View>

          {/* Cột giữa: Thông tin thói quen */}
          <View style={styles.details}>
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.title,
                  { color: colors.text },
                  isCompleted && styles.completedTitle,
                ]}
                numberOfLines={1}
              >
                {habit.title}
              </Text>
            </View>

            {habit.description ? (
              <Text
                style={[styles.description, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {habit.description}
              </Text>
            ) : null}

            {/* Badges metadata: Giờ nhắc, Streak, Note */}
            <View style={styles.metaRow}>
              {habit.reminderEnabled && habit.reminderTime ? (
                <View style={[styles.metaBadge, { backgroundColor: colors.surfaceSubtle }]}>
                  <Ionicons name="alarm-outline" size={11} color={colors.textSecondary} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    {habit.reminderTime}
                  </Text>
                </View>
              ) : null}

              {streakInfo.currentStreak > 0 ? (
                <View style={[styles.metaBadge, { backgroundColor: '#FFF3E0' }]}>
                  <Text style={[styles.metaText, { color: '#E65100', fontWeight: '700' }]}>
                    🔥 {streakInfo.currentStreak} ngày
                  </Text>
                </View>
              ) : null}

              {log?.note ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onAddNote}
                  style={[styles.metaBadge, { backgroundColor: colors.primaryLight }]}
                >
                  <Ionicons name="document-text-outline" size={11} color={colors.primary} />
                  <Text
                    style={[styles.metaText, { color: colors.primary, maxWidth: 110 }]}
                    numberOfLines={1}
                  >
                    {log.note}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onAddNote}
                  style={[styles.noteButton]}
                >
                  <Ionicons name="create-outline" size={13} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Progress bar nếu targetCount > 1 */}
            {hasMultipleTargets ? (
              <View style={styles.progressBarWrapper}>
                <View style={[styles.progressTrack, { backgroundColor: colors.surfaceSubtle }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: habit.color || colors.primary,
                        width: `${Math.min(100, (currentCount / targetCount) * 100)}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.progressCountText, { color: colors.textSecondary }]}>
                  {currentCount}/{targetCount} {habit.unit || 'lần'}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Cột phải: Action Checkbox hoặc Counter button */}
          <View style={styles.actionContainer}>
            {hasMultipleTargets ? (
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={onIncrement}
                style={[
                  styles.counterButton,
                  {
                    backgroundColor: isCompleted ? colors.primary : colors.primaryLight,
                    borderColor: colors.primary,
                  },
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="add" size={16} color={colors.primary} />
                    <Text style={[styles.counterText, { color: colors.primary }]}>
                      +1
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={onToggle}
                style={[
                  styles.checkbox,
                  {
                    borderColor: isCompleted ? colors.primary : colors.borderFocus,
                    backgroundColor: isCompleted ? colors.primary : 'transparent',
                  },
                ]}
              >
                {isCompleted && (
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </ReanimatedSwipeable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: spacing.lg,
    marginVertical: 5,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md + 2,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  details: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...typography.label,
    fontSize: 15,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.65,
  },
  description: {
    ...typography.bodySmall,
    fontSize: 12,
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 5,
    gap: 6,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '500',
  },
  noteButton: {
    padding: 3,
  },
  progressBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressCountText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionContainer: {
    marginLeft: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    minWidth: 46,
    height: 34,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 2,
  },
  rightActionsContainer: {
    width: 75,
    flexDirection: 'row',
  },
  leftActionsContainer: {
    width: 75,
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
    marginVertical: 1,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
    textAlign: 'center',
  },
});
