import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';
import { CustomButton } from './CustomButton';
import { borderRadius, spacing, typography } from '../theme';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Chưa có thói quen nào',
  description = 'Hãy tạo thói quen đầu tiên để bắt đầu hành trình xây dựng lối sống năng suất và kỷ luật!',
  icon = 'leaf-outline',
  actionText = 'Tạo thói quen mới',
  onAction,
}) => {
  const { colors } = useThemeStore();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name={icon} size={48} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>

      {onAction && actionText ? (
        <CustomButton
          title={actionText}
          icon="add"
          onPress={onAction}
          style={styles.button}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h3,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  description: {
    ...typography.body,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 280,
    marginBottom: spacing.xl,
  },
  button: {
    minWidth: 180,
  },
});
