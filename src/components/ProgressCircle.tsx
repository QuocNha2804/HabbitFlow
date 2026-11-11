import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useThemeStore } from '../store/useThemeStore';
import { getMotivationalQuote } from '../utils/dateHelpers';
import { borderRadius, shadow, spacing, typography } from '../theme';

interface ProgressCircleProps {
  completed: number;
  total: number;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({ completed, total }) => {
  const { colors } = useThemeStore();
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const quote = getMotivationalQuote(percentage);

  // SVG circular dimension
  const size = 100;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        shadow.card,
      ]}
    >
      <View style={styles.contentRow}>
        {/* Vòng tròn SVG */}
        <View style={styles.circleWrapper}>
          <Svg width={size} height={size}>
            <Defs>
              <LinearGradient id="sageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#84BF93" />
                <Stop offset="100%" stopColor={colors.primary} />
              </LinearGradient>
            </Defs>
            {/* Background track */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.surfaceSubtle}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Active progress */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#sageGrad)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              rotation="-90"
              origin={`${size / 2}, ${size / 2}`}
            />
          </Svg>
          <View style={styles.centerLabel}>
            <Text style={[styles.percentText, { color: colors.text }]}>{percentage}%</Text>
            <Text style={[styles.percentSub, { color: colors.textMuted }]}>hoàn thành</Text>
          </View>
        </View>

        {/* Thông tin mô tả bên phải */}
        <View style={styles.infoWrapper}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: percentage === 100 ? colors.primaryLight : colors.surfaceSubtle,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: percentage === 100 ? colors.primary : colors.textSecondary },
              ]}
            >
              {completed} / {total} thói quen
            </Text>
          </View>

          <Text style={[styles.quoteText, { color: colors.text }]}>{quote}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleWrapper: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    ...typography.h3,
    fontSize: 20,
    fontWeight: '800',
  },
  percentSub: {
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  infoWrapper: {
    flex: 1,
    paddingLeft: spacing.lg,
    justifyContent: 'center',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '700',
  },
  quoteText: {
    ...typography.body,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
});
