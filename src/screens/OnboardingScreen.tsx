import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { CustomButton } from '../components/CustomButton';
import { STARTER_GOALS } from '../utils/habitTemplates';
import { notificationService } from '../services/notificationService';
import { borderRadius, shadow, spacing, typography } from '../theme';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

interface Props {
  navigation: OnboardingScreenNavigationProp;
}

const { width } = Dimensions.get('window');

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useThemeStore();
  const {
    setOnboardingGoal,
    onboardingGoal,
    setDefaultReminderTime,
    defaultReminderTime,
    completeOnboarding,
  } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(0);

  const defaultTimes = ['07:00', '08:00', '09:00', '20:00', '21:00'];

  const handleNext = async () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      // Step 3: Xin quyền notification và hoàn thành onboarding
      await notificationService.requestPermissions();
      await completeOnboarding();
      navigation.replace('Register');
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <View style={[styles.logoIcon, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="leaf" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.logoText, { color: colors.text }]}>HabitFlow</Text>
        </View>

        {currentStep < 2 && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={[styles.skipText, { color: colors.textSecondary }]}>Bỏ qua</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.body}>
        {currentStep === 0 && (
          <View style={styles.slideContainer}>
            <View style={[styles.heroBadge, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="sparkles" size={56} color={colors.primary} />
            </View>
            <Text style={[styles.heroTitle, { color: colors.text }]}>
              Xây dựng thói quen,{'\n'}
              <Text style={{ color: colors.primary }}>làm chủ cuộc sống</Text>
            </Text>
            <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
              Theo dõi thói quen hàng ngày, duy trì chuỗi streak rực lửa và nhận thông báo nhắc nhở thông minh không bỏ lỡ.
            </Text>

            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Ionicons name="flame" size={18} color="#FF7043" />
                <Text style={[styles.featureText, { color: colors.text }]}>Chuỗi streak liên tiếp truyền cảm hứng</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="analytics" size={18} color={colors.primary} />
                <Text style={[styles.featureText, { color: colors.text }]}>Biểu đồ & Heatmap theo dõi năng suất</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="shield-checkmark" size={18} color="#42A5F5" />
                <Text style={[styles.featureText, { color: colors.text }]}>100% riêng tư, dữ liệu lưu an toàn trên máy</Text>
              </View>
            </View>
          </View>
        )}

        {currentStep === 1 && (
          <View style={styles.slideContainer}>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              Mục tiêu lớn nhất của bạn là gì? 🎯
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
              HabitFlow sẽ cá nhân hóa và chuẩn bị sẵn các thói quen mẫu phù hợp cho bạn.
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.goalsList}>
              {STARTER_GOALS.map((goal) => {
                const isSelected = onboardingGoal === goal.id;
                return (
                  <TouchableOpacity
                    key={goal.id}
                    activeOpacity={0.8}
                    onPress={() => setOnboardingGoal(goal.id)}
                    style={[
                      styles.goalCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                      isSelected && { backgroundColor: colors.primaryLight },
                      shadow.soft,
                    ]}
                  >
                    <View
                      style={[
                        styles.goalIcon,
                        { backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle },
                      ]}
                    >
                      <Ionicons
                        name={goal.icon as any}
                        size={22}
                        color={isSelected ? '#FFFFFF' : colors.primary}
                      />
                    </View>
                    <View style={styles.goalInfo}>
                      <Text style={[styles.goalTitle, { color: colors.text }]}>{goal.title}</Text>
                      <Text style={[styles.goalDesc, { color: colors.textSecondary }]}>
                        {goal.description}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.slideContainer}>
            <View style={[styles.heroBadge, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="alarm" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.stepTitle, { color: colors.text }]}>
              Giờ nhắc nhở mặc định ⏰
            </Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
              Chọn khung giờ thuận tiện nhất để HabitFlow gửi thông báo nhắc bạn bắt đầu ngày mới.
            </Text>

            <View style={styles.timePillsContainer}>
              {defaultTimes.map((time) => {
                const isSelected = defaultReminderTime === time;
                return (
                  <TouchableOpacity
                    key={time}
                    onPress={() => setDefaultReminderTime(time)}
                    style={[
                      styles.timePill,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.card,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                      shadow.soft,
                    ]}
                  >
                    <Text
                      style={[
                        styles.timePillText,
                        { color: isSelected ? '#FFFFFF' : colors.text },
                      ]}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </View>

      {/* Footer: Pagination dots & Button */}
      <View style={styles.footer}>
        <View style={styles.dotsRow}>
          {[0, 1, 2].map((idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                {
                  backgroundColor: currentStep === idx ? colors.primary : colors.border,
                  width: currentStep === idx ? 22 : 7,
                },
              ]}
            />
          ))}
        </View>

        <CustomButton
          title={currentStep === 2 ? 'Khám phá ngay' : 'Tiếp tục'}
          icon={currentStep === 2 ? 'rocket-outline' : 'arrow-forward'}
          iconPosition="right"
          size="lg"
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    ...typography.h3,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipText: {
    ...typography.label,
    fontSize: 13,
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  heroBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.xl,
  },
  heroTitle: {
    ...typography.h1,
    fontSize: 26,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: spacing.md,
  },
  heroSubtitle: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  featureList: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.02)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  featureText: {
    ...typography.body,
    fontSize: 13,
    fontWeight: '500',
  },
  stepTitle: {
    ...typography.h2,
    fontSize: 22,
    marginBottom: spacing.xs,
  },
  stepSubtitle: {
    ...typography.body,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  goalsList: {
    maxHeight: 380,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    marginBottom: spacing.md,
  },
  goalIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  goalInfo: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  goalTitle: {
    ...typography.label,
    fontSize: 15,
  },
  goalDesc: {
    ...typography.caption,
    fontSize: 12,
    marginTop: 2,
  },
  timePillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  timePill: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
  },
  timePillText: {
    ...typography.h3,
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xl,
  },
  dot: {
    height: 7,
    borderRadius: 3.5,
  },
});
