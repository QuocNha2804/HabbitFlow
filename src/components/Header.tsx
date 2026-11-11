import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { getGreeting, formatHeaderDate } from '../utils/dateHelpers';
import { borderRadius, spacing, typography } from '../theme';

interface HeaderProps {
  onAvatarPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAvatarPress }) => {
  const { colors } = useThemeStore();
  const { currentUser } = useAuthStore();
  const { greeting, subGreeting } = getGreeting(currentUser?.name?.split(' ')[0]);
  const dateText = formatHeaderDate();

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={[styles.dateText, { color: colors.textSecondary }]}>{dateText}</Text>
        <Text style={[styles.greetingText, { color: colors.text }]} numberOfLines={1}>
          {greeting}
        </Text>
        <Text style={[styles.subGreetingText, { color: colors.textMuted }]} numberOfLines={1}>
          {subGreeting}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onAvatarPress}
        style={[
          styles.avatarContainer,
          {
            backgroundColor: colors.primaryLight,
            borderColor: colors.border,
          },
        ]}
      >
        {currentUser?.avatarUri ? (
          <Image source={{ uri: currentUser.avatarUri }} style={styles.avatarImage} />
        ) : (
          <View style={[styles.avatarFallback, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarLetter}>
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'H'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  textContainer: {
    flex: 1,
    paddingRight: spacing.md,
  },
  dateText: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
    fontWeight: '600',
  },
  greetingText: {
    ...typography.h2,
    fontSize: 20,
    fontWeight: '700',
  },
  subGreetingText: {
    ...typography.bodySmall,
    marginTop: 2,
  },
  avatarContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 23,
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
