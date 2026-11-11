import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { useHabitStore } from '../store/useHabitStore';
import { CustomButton } from '../components/CustomButton';
import { generateStarterHabits } from '../utils/habitTemplates';
import { apiService } from '../services/apiService';
import { borderRadius, shadow, spacing, typography } from '../theme';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useThemeStore();
  const { register, onboardingGoal } = useAuthStore();
  const { loadUserData } = useHabitStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ và tên của bạn.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    const res = await register(name.trim(), email.trim(), password);

    if (res.success && res.user) {
      // Tự động khởi tạo thói quen mẫu dựa trên mục tiêu Onboarding
      try {
        const starterHabits = generateStarterHabits(onboardingGoal || 'health', res.user.id);
        await apiService.syncUserData(res.user.id, starterHabits, []);
        await loadUserData(res.user.id);
      } catch (e) {
        console.warn('Lỗi tạo starter habits:', e);
      }
    } else {
      setLoading(false);
      Alert.alert('Đăng ký không thành công', res.message || 'Email này có thể đã được đăng ký.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.logoBadge, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="sparkles" size={28} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Tạo tài khoản mới 🌱</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Bắt đầu hành trình kỷ luật và phát triển bản thân cùng HabitFlow.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Họ và tên</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  shadow.soft,
                ]}
              >
                <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Nguyễn Văn A"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  shadow.soft,
                ]}
              >
                <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="name@example.com"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Mật khẩu</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  shadow.soft,
                ]}
              >
                <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Tối thiểu 6 ký tự"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Xác nhận mật khẩu</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  shadow.soft,
                ]}
              >
                <Ionicons name="shield-checkmark-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Nhập lại mật khẩu"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>
            </View>

            {/* Submit Button */}
            <CustomButton
              title="Đăng ký tài khoản"
              size="lg"
              loading={loading}
              onPress={handleRegister}
              style={styles.submitBtn}
            />
          </View>

          {/* Footer Login link */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Đã có tài khoản?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoBadge: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    fontSize: 23,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    maxWidth: 290,
  },
  form: {
    marginBottom: spacing.xl,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
  },
  eyeBtn: {
    padding: 6,
  },
  submitBtn: {
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  footerText: {
    ...typography.body,
    fontSize: 14,
  },
  loginLink: {
    ...typography.label,
    fontSize: 14,
    fontWeight: '700',
  },
});
