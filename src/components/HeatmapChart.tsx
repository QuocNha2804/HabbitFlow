import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { HabitLog } from '../types';
import { getHeatmapDays } from '../utils/dateHelpers';
import { parseISO } from 'date-fns';
import { borderRadius, spacing, typography } from '../theme';

interface HeatmapChartProps {
  logs: HabitLog[];
  weeks?: number;
}

export const HeatmapChart: React.FC<HeatmapChartProps> = ({ logs, weeks = 12 }) => {
  const { colors } = useThemeStore();
  const allDays = getHeatmapDays(weeks);

  // Thống kê số lượng hoàn thành theo từng ngày
  const countsByDate: Record<string, number> = {};
  logs.forEach((l) => {
    if (l.completed) {
      countsByDate[l.date] = (countsByDate[l.date] || 0) + 1;
    }
  });

  // Gom ngày theo tuần (cột)
  const columns: { dateKey: string; count: number; dayOfWeek: number }[][] = [];
  let currentWeek: { dateKey: string; count: number; dayOfWeek: number }[] = [];

  allDays.forEach((dateKey) => {
    const d = parseISO(dateKey);
    const dayOfWeek = d.getDay(); // 0 = CN, 1 = T2, ...
    currentWeek.push({
      dateKey,
      count: countsByDate[dateKey] || 0,
      dayOfWeek,
    });

    if (dayOfWeek === 0 || currentWeek.length === 7) {
      columns.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    columns.push(currentWeek);
  }

  const getCellColor = (count: number): string => {
    if (count === 0) return colors.surfaceSubtle;
    if (count === 1) return '#D2E8D7';
    if (count === 2) return '#84BF93';
    return colors.primary;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Heatmap 12 tuần gần nhất</Text>
        <View style={styles.legend}>
          <Text style={[styles.legendText, { color: colors.textMuted }]}>Ít</Text>
          <View style={[styles.legendBox, { backgroundColor: colors.surfaceSubtle }]} />
          <View style={[styles.legendBox, { backgroundColor: '#D2E8D7' }]} />
          <View style={[styles.legendBox, { backgroundColor: '#84BF93' }]} />
          <View style={[styles.legendBox, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendText, { color: colors.textMuted }]}>Nhiều</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.grid}>
        {columns.map((week, colIdx) => (
          <View key={colIdx} style={styles.column}>
            {week.map((cell) => (
              <View
                key={cell.dateKey}
                style={[
                  styles.cell,
                  {
                    backgroundColor: getCellColor(cell.count),
                    borderColor: colors.card,
                  },
                ]}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.label,
    fontSize: 14,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '500',
  },
  legendBox: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  grid: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  column: {
    flexDirection: 'column',
    marginRight: 4,
  },
  cell: {
    width: 13,
    height: 13,
    borderRadius: 3,
    marginBottom: 4,
    borderWidth: 1,
  },
});
