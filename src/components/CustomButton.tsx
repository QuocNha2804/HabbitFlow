import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';
import { borderRadius, spacing, typography } from '../theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const { colors } = useThemeStore();

  const getContainerStyles = (): ViewStyle => {
    // Size styles
    let paddingVertical = spacing.md;
    let paddingHorizontal = spacing.lg;
    let radius = borderRadius.md;

    if (size === 'sm') {
      paddingVertical = spacing.sm;
      paddingHorizontal = spacing.md;
      radius = borderRadius.sm;
    } else if (size === 'lg') {
      paddingVertical = spacing.lg;
      paddingHorizontal = spacing.xxl;
      radius = borderRadius.lg;
    }

    // Variant styles
    let backgroundColor = colors.primary;
    let borderWidth = 0;
    let borderColor = 'transparent';

    switch (variant) {
      case 'primary':
        backgroundColor = colors.primary;
        break;
      case 'secondary':
        backgroundColor = colors.primaryLight;
        break;
      case 'outline':
        backgroundColor = 'transparent';
        borderWidth = 1.5;
        borderColor = colors.primary;
        break;
      case 'danger':
        backgroundColor = colors.danger;
        break;
      case 'ghost':
        backgroundColor = 'transparent';
        break;
    }

    return {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius,
      paddingHorizontal,
      paddingVertical,
      backgroundColor,
      borderWidth,
      borderColor,
      opacity: disabled || loading ? 0.55 : 1,
    };
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return '#FFFFFF';
      case 'secondary':
      case 'outline':
        return colors.primary;
      case 'ghost':
        return colors.textSecondary;
      default:
        return '#FFFFFF';
    }
  };

  const iconColor = getTextColor();
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[getContainerStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={iconSize} color={iconColor} style={styles.iconLeft} />
          )}
          <Text
            style={[
              styles.text,
              { color: getTextColor() },
              size === 'sm' && styles.textSm,
              size === 'lg' && styles.textLg,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={iconSize} color={iconColor} style={styles.iconRight} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.label,
    fontSize: 15,
  },
  textSm: {
    fontSize: 13,
  },
  textLg: {
    fontSize: 16,
    fontWeight: '700',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
});
