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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { useThemeStore } from '../store/useThemeStore';
import { apiService } from '../services/apiService';
import { CustomButton } from '../components/CustomButton';
import { borderRadius, shadow, spacing, typography } from '../theme';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'ForgotPassword'
>;

interface Props {
  navigation: ForgotPasswordScreenNavigationProp;
}

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useThemeStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [recoveredPass, setRecoveredPass] = useState<string | null>(null);

  const handleLookup = async () => {
    if (!email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập email tài khoản của bạn.');
      return;
    }

    setLoading(true);
    const res = await apiService.lookupPassword(email.trim());
    setLoading(false);

    if (res.success && res.data) {
      setRecoveredPass(res.data);
    } else {
      Alert.alert('Không tìm thấy', res.message || 'Không có tài khoản nào khớp với email này.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="key-outline" size={36} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Quên mật khẩu? 🔐</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Vì ứng dụng hoạt động offline và lưu trữ bảo mật trên thiết bị, hãy nhập email bạn đã đăng ký để kiểm tra lại mật khẩu.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email đã đăng ký</Text>
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

          <CustomButton
            title="Tìm lại mật khẩu"
            size="lg"
            loading={loading}
            onPress={handleLookup}
            style={{ marginTop: spacing.sm }}
          />

          {recoveredPass && (
            <View
              style={[
                styles.resultCard,
                { backgroundColor: colors.primaryLight, borderColor: colors.primary },
              ]}
            >
              <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
              <View style={styles.resultInfo}>
                <Text style={[styles.resultTitle, { color: colors.text }]}>
                  Mật khẩu của bạn là:
                </Text>
                <Text style={[styles.resultPass, { color: colors.primaryDark }]}>
                  {recoveredPass}
                </Text>
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.returnBtn}>
          <Text style={[styles.returnText, { color: colors.primary }]}>
            ← Quay lại màn hình Đăng nhập
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
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
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    marginTop: spacing.lg,
  },
  resultInfo: {
    marginLeft: spacing.md,
  },
  resultTitle: {
    ...typography.caption,
    fontSize: 12,
  },
  resultPass: {
    ...typography.h3,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  returnBtn: {
    alignSelf: 'center',
    padding: spacing.sm,
  },
  returnText: {
    ...typography.label,
    fontSize: 14,
  },
});
