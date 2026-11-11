import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { getWeekDays, formatDateKey } from '../utils/dateHelpers';
import { borderRadius, spacing, typography } from '../theme';

interface WeekStripProps {
  selectedDateKey: string;
  onSelectDate: (dateKey: string) => void;
  completedDates?: Set<string>;
}

export const WeekStrip: React.FC<WeekStripProps> = ({
  selectedDateKey,
  onSelectDate,
  completedDates,
}) => {
  const { colors } = useThemeStore();
  const weekDays = getWeekDays(new Date());
  const todayKey = formatDateKey();

  return (
    <View style={styles.container}>
      {weekDays.map((item) => {
        const isSelected = item.dateKey === selectedDateKey;
        const isTodayItem = item.dateKey === todayKey;
        const isDone = completedDates?.has(item.dateKey);

        return (
          <TouchableOpacity
            key={item.dateKey}
            activeOpacity={0.7}
            onPress={() => onSelectDate(item.dateKey)}
            style={[
              styles.dayPill,
              {
                backgroundColor: isSelected ? colors.primary : colors.card,
                borderColor: isSelected ? colors.primary : isTodayItem ? colors.borderFocus : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.dayLabel,
                { color: isSelected ? '#FFFFFF' : isTodayItem ? colors.primary : colors.textSecondary },
              ]}
            >
              {item.dayLabel}
            </Text>

            <Text
              style={[
                styles.dayNumber,
                { color: isSelected ? '#FFFFFF' : colors.text },
              ]}
            >
              {item.dayNumber}
            </Text>

            {/* Indicator dot */}
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: isSelected
                    ? '#FFFFFF'
                    : isDone
                    ? colors.primary
                    : 'transparent',
                },
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  dayPill: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minHeight: 64,
  },
  dayLabel: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  dayNumber: {
    ...typography.label,
    fontSize: 16,
    fontWeight: '700',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 5,
  },
});
