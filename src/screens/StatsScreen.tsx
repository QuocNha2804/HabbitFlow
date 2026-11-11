import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import Svg, { Rect, Line, Circle, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { useHabitStore } from '../store/useHabitStore';
import { HeatmapChart } from '../components/HeatmapChart';
import { getWeekDays, formatDateKey } from '../utils/dateHelpers';
import { borderRadius, shadow, spacing, typography } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const StatsScreen: React.FC = () => {
  const { colors } = useThemeStore();
  const { currentUser } = useAuthStore();
  const { habits, habitLogs, getStats } = useHabitStore();

  const stats = useMemo(() => {
    return getStats(currentUser?.id || '');
  }, [habits, habitLogs, currentUser?.id]);

  // Dữ liệu biểu đồ tuần (T2 -> CN)
  const weekData = useMemo(() => {
    const weekDays = getWeekDays(new Date());
    return weekDays.map((item) => {
      const count = habitLogs.filter((l) => l.date === item.dateKey && l.completed).length;
      return {
        label: item.dayLabel,
        count,
        dateKey: item.dateKey,
        isToday: item.dateKey === formatDateKey(),
      };
    });
  }, [habitLogs]);

  const maxWeekCount = Math.max(1, ...weekData.map((d) => d.count));

  // Tỉ lệ hoàn thành theo từng thói quen
  const habitCompletionRates = useMemo(() => {
    return habits.map((h) => {
      const logsForHabit = habitLogs.filter((l) => l.habitId === h.id);
      const doneCount = logsForHabit.filter((l) => l.completed).length;
      const rate = logsForHabit.length > 0 ? Math.round((doneCount / logsForHabit.length) * 100) : 0;
      return {
        id: h.id,
        title: h.title,
        icon: h.icon,
        color: h.color,
        doneCount,
        rate,
      };
    });
  }, [habits, habitLogs]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Thống kê & Năng suất 📈</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Phân tích hành trình xây dựng kỷ luật và tiến độ mục tiêu của bạn.
          </Text>
        </View>

        {/* 4 Summary KPI Cards */}
        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.border }, shadow.soft]}>
            <View style={[styles.kpiIcon, { backgroundColor: '#FFF3E0' }]}>
              <Text style={{ fontSize: 18 }}>🔥</Text>
            </View>
            <Text style={[styles.kpiValue, { color: colors.text }]}>{stats.currentStreak}</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Streak hiện tại</Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.border }, shadow.soft]}>
            <View style={[styles.kpiIcon, { backgroundColor: '#E8F5E9' }]}>
              <Text style={{ fontSize: 18 }}>🏆</Text>
            </View>
            <Text style={[styles.kpiValue, { color: colors.text }]}>{stats.longestStreak}</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Kỷ lục dài nhất</Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.border }, shadow.soft]}>
            <View style={[styles.kpiIcon, { backgroundColor: colors.primaryLight }]}>
              <Text style={{ fontSize: 18 }}>✅</Text>
            </View>
            <Text style={[styles.kpiValue, { color: colors.text }]}>{stats.totalCompletions}</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Tổng lượt xong</Text>
          </View>

          <View style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.border }, shadow.soft]}>
            <View style={[styles.kpiIcon, { backgroundColor: '#EDE7F6' }]}>
              <Text style={{ fontSize: 18 }}>📊</Text>
            </View>
            <Text style={[styles.kpiValue, { color: colors.text }]}>{stats.completionRate}%</Text>
            <Text style={[styles.kpiLabel, { color: colors.textSecondary }]}>Tỉ lệ hoàn thành</Text>
          </View>
        </View>

        {/* Biểu đồ tuần (Bar Chart - SVG) */}
        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }, shadow.card]}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={[styles.chartTitle, { color: colors.text }]}>Số thói quen xong tuần này</Text>
              <Text style={[styles.chartSub, { color: colors.textSecondary }]}>Thứ 2 đến Chủ Nhật</Text>
            </View>
            <View style={[styles.totalWeekBadge, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.totalWeekText, { color: colors.primaryDark }]}>
                {weekData.reduce((acc, curr) => acc + curr.count, 0)} lượt
              </Text>
            </View>
          </View>

          {/* SVG Bar Chart */}
          <View style={styles.svgContainer}>
            <Svg width={SCREEN_WIDTH - 72} height={150}>
              <Defs>
                <LinearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor={colors.primary} />
                  <Stop offset="100%" stopColor="#84BF93" />
                </LinearGradient>
              </Defs>

              {/* Grid lines */}
              <Line x1="0" y1="30" x2={SCREEN_WIDTH - 72} y2="30" stroke={colors.surfaceSubtle} strokeDasharray="4 4" />
              <Line x1="0" y1="75" x2={SCREEN_WIDTH - 72} y2="75" stroke={colors.surfaceSubtle} strokeDasharray="4 4" />
              <Line x1="0" y1="120" x2={SCREEN_WIDTH - 72} y2="120" stroke={colors.border} />

              {/* Bars */}
              {weekData.map((d, index) => {
                const barWidth = 24;
                const totalWidth = SCREEN_WIDTH - 72;
                const spacingX = totalWidth / 7;
                const x = index * spacingX + (spacingX - barWidth) / 2;

                const maxBarHeight = 90;
                const barHeight = Math.max(4, (d.count / maxWeekCount) * maxBarHeight);
                const y = 120 - barHeight;

                return (
                  <React.Fragment key={d.label}>
                    {/* Value above bar */}
                    {d.count > 0 && (
                      <SvgText
                        x={x + barWidth / 2}
                        y={y - 6}
                        fill={colors.textSecondary}
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {d.count}
                      </SvgText>
                    )}

                    {/* Bar */}
                    <Rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx={6}
                      fill={d.isToday ? 'url(#barGrad)' : colors.surfaceSubtle}
                    />

                    {/* Label below bar */}
                    <SvgText
                      x={x + barWidth / 2}
                      y={138}
                      fill={d.isToday ? colors.primary : colors.textMuted}
                      fontSize="11"
                      fontWeight={d.isToday ? '700' : '500'}
                      textAnchor="middle"
                    >
                      {d.label}
                    </SvgText>
                  </React.Fragment>
                );
              })}
            </Svg>
          </View>
        </View>

        {/* Heatmap 12 tuần kiểu GitHub */}
        <HeatmapChart logs={habitLogs} weeks={12} />

        {/* Tỉ lệ hoàn thành theo từng thói quen */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Hiệu suất từng thói quen</Text>
          <View style={styles.habitsRateList}>
            {habitCompletionRates.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.habitRateItem,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  shadow.soft,
                ]}
              >
                <View style={styles.habitRateHeader}>
                  <View style={styles.habitRateLeft}>
                    <View
                      style={[
                        styles.rateIcon,
                        { backgroundColor: item.color ? `${item.color}18` : colors.primaryLight },
                      ]}
                    >
                      <Ionicons
                        name={(item.icon as any) || 'leaf-outline'}
                        size={18}
                        color={item.color || colors.primary}
                      />
                    </View>
                    <Text style={[styles.rateTitle, { color: colors.text }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </View>
                  <Text style={[styles.ratePercent, { color: colors.primaryDark }]}>
                    {item.rate}%
                  </Text>
                </View>

                {/* Progress bar */}
                <View style={[styles.rateTrack, { backgroundColor: colors.surfaceSubtle }]}>
                  <View
                    style={[
                      styles.rateFill,
                      {
                        backgroundColor: item.color || colors.primary,
                        width: `${item.rate}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}

            {habitCompletionRates.length === 0 && (
              <Text style={[styles.emptyHint, { color: colors.textMuted }]}>
                Chưa có thói quen nào để phân tích hiệu suất.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
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
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginVertical: spacing.md,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
  },
  kpiIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  kpiValue: {
    ...typography.h2,
    fontSize: 22,
    fontWeight: '800',
  },
  kpiLabel: {
    ...typography.caption,
    fontSize: 11,
    marginTop: 2,
  },
  chartCard: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  chartTitle: {
    ...typography.label,
    fontSize: 15,
  },
  chartSub: {
    ...typography.caption,
    fontSize: 11,
  },
  totalWeekBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  totalWeekText: {
    ...typography.caption,
    fontWeight: '700',
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  habitsRateList: {
    gap: spacing.sm,
  },
  habitRateItem: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  habitRateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitRateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: spacing.sm,
  },
  rateIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  rateTitle: {
    ...typography.label,
    fontSize: 14,
    flex: 1,
  },
  ratePercent: {
    ...typography.label,
    fontSize: 14,
    fontWeight: '800',
  },
  rateTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  rateFill: {
    height: '100%',
    borderRadius: 3,
  },
  emptyHint: {
    ...typography.bodySmall,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});
