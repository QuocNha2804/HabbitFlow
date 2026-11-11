import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { HabitFilter } from '../types';
import { borderRadius, spacing, typography } from '../theme';

interface FilterTabsProps {
  currentFilter: HabitFilter;
  onSelect: (filter: HabitFilter) => void;
  counts: { all: number; pending: number; completed: number };
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ currentFilter, onSelect, counts }) => {
  const { colors } = useThemeStore();

  const tabs: { key: HabitFilter; label: string; count: number }[] = [
    { key: 'all', label: 'Tất cả', count: counts.all },
    { key: 'pending', label: 'Chưa xong', count: counts.pending },
    { key: 'completed', label: 'Đã xong', count: counts.completed },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = currentFilter === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.7}
            onPress={() => onSelect(tab.key)}
            style={[
              styles.tabPill,
              {
                backgroundColor: isActive ? colors.primaryLight : 'transparent',
                borderColor: isActive ? colors.primary : 'transparent',
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: isActive ? colors.primaryDark : colors.textSecondary },
                isActive && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
            <View
              style={[
                styles.countBadge,
                {
                  backgroundColor: isActive ? colors.primary : colors.surfaceSubtle,
                },
              ]}
            >
              <Text
                style={[
                  styles.countText,
                  { color: isActive ? '#FFFFFF' : colors.textMuted },
                ]}
              >
                {tab.count}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  tabText: {
    ...typography.caption,
    fontSize: 12,
  },
  tabTextActive: {
    fontWeight: '700',
  },
  countBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.full,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
