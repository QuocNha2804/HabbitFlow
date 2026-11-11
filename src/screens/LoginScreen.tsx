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
import { CustomButton } from '../components/CustomButton';
import { borderRadius, shadow, spacing, typography } from '../theme';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useThemeStore();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);

    if (!res.success) {
      Alert.alert('Đăng nhập thất bại', res.message || 'Email hoặc mật khẩu không chính xác.');
    }
  };

  const handleQuickDemo = async () => {
    setEmail('demo@habitflow.app');
    setPassword('123456');
    setLoading(true);
    const res = await login('demo@habitflow.app', '123456');
    setLoading(false);
    if (!res.success) {
      Alert.alert('Đăng nhập thất bại', res.message || 'Không thể đăng nhập tài khoản demo.');
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
              <Ionicons name="leaf" size={32} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Chào mừng trở lại! 👋</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Đăng nhập để tiếp tục duy trì những thói quen tốt mỗi ngày.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
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
              <View style={styles.passwordHeader}>
                <Text style={[styles.label, { color: colors.text }]}>Mật khẩu</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={[styles.forgotLink, { color: colors.primary }]}>Quên mật khẩu?</Text>
                </TouchableOpacity>
              </View>
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
                  placeholder="••••••••"
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

            {/* Submit Button */}
            <CustomButton
              title="Đăng nhập"
              size="lg"
              loading={loading}
              onPress={handleLogin}
              style={styles.submitBtn}
            />

            {/* Demo Quick Button */}
            <TouchableOpacity onPress={handleQuickDemo} style={styles.demoBtn}>
              <Text style={[styles.demoBtnText, { color: colors.textSecondary }]}>
                Điền nhanh tài khoản mẫu (Demo)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Register link */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Chưa có tài khoản?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.registerLink, { color: colors.primary }]}>Đăng ký ngay</Text>
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
    paddingVertical: spacing.xxl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    maxWidth: 300,
  },
  form: {
    marginBottom: spacing.xxl,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.label,
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  forgotLink: {
    ...typography.caption,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    height: 52,
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
  demoBtn: {
    alignSelf: 'center',
    marginTop: spacing.md,
    padding: spacing.xs,
  },
  demoBtnText: {
    ...typography.caption,
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  footerText: {
    ...typography.body,
    fontSize: 14,
  },
  registerLink: {
    ...typography.label,
    fontSize: 14,
    fontWeight: '700',
  },
});
