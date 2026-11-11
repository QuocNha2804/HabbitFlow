import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { useHabitStore } from '../store/useHabitStore';
import { backupService } from '../services/backupService';
import { CustomButton } from '../components/CustomButton';
import { borderRadius, shadow, spacing, typography } from '../theme';

export const ProfileScreen: React.FC = () => {
  const { colors, isDarkMode, toggleTheme } = useThemeStore();
  const { currentUser, logout, updateProfile } = useAuthStore();
  const { habits, habitLogs, resetUserData, importUserData } = useHabitStore();

  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [defaultTime, setDefaultTime] = useState(currentUser?.defaultReminderTime || '08:00');
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(currentUser?.name || '');

  const handlePickAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        await updateProfile({ avatarUri: result.assets[0].uri });
      }
    } catch (e) {
      Alert.alert('Thông báo', 'Không thể mở thư viện ảnh.');
    }
  };

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    await updateProfile({ name: newName.trim() });
    setEditingName(false);
  };

  const handleExportData = async () => {
    if (!currentUser?.id) return;
    const ok = await backupService.exportData(currentUser.id, habits, habitLogs);
    if (!ok) {
      Alert.alert('Lỗi', 'Không thể xuất dữ liệu. Vui lòng thử lại.');
    }
  };

  const handleImportData = async () => {
    if (!currentUser?.id) return;
    const backup = await backupService.importData();
    if (!backup) {
      Alert.alert('Lỗi', 'Tệp sao lưu không hợp lệ hoặc bạn đã hủy chọn.');
      return;
    }

    Alert.alert(
      'Khôi phục dữ liệu',
      `Tệp này gồm ${backup.habits.length} thói quen và ${backup.habitLogs.length} nhật ký. Bạn có muốn nhập vào tài khoản này không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Nhập dữ liệu',
          onPress: async () => {
            await importUserData(currentUser.id, backup.habits, backup.habitLogs);
            Alert.alert('Thành công', 'Đã khôi phục dữ liệu thành công!');
          },
        },
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Xóa toàn bộ dữ liệu?',
      'Hành động này sẽ xóa vĩnh viễn toàn bộ thói quen và lịch sử check-in của bạn. Bạn không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa sạch dữ liệu',
          style: 'destructive',
          onPress: async () => {
            if (currentUser?.id) {
              await resetUserData(currentUser.id);
              Alert.alert('Đã xóa', 'Dữ liệu thói quen đã được đặt lại hoàn toàn.');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Tài khoản & Cài đặt ⚙️</Text>
        </View>

        {/* User Profile Card */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.card, borderColor: colors.border },
            shadow.card,
          ]}
        >
          <TouchableOpacity onPress={handlePickAvatar} activeOpacity={0.8} style={styles.avatarWrapper}>
            {currentUser?.avatarUri ? (
              <Image source={{ uri: currentUser.avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarLetter}>
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'H'}
                </Text>
              </View>
            )}
            <View style={[styles.cameraBadge, { backgroundColor: colors.primary }]}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {editingName ? (
            <View style={styles.editNameRow}>
              <TextInput
                style={[
                  styles.nameInput,
                  { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text },
                ]}
                value={newName}
                onChangeText={setNewName}
                autoFocus
              />
              <TouchableOpacity onPress={handleSaveName} style={[styles.saveNameBtn, { backgroundColor: colors.primary }]}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setEditingName(true)}
              style={styles.nameRow}
              activeOpacity={0.7}
            >
              <Text style={[styles.userName, { color: colors.text }]}>
                {currentUser?.name || 'Người dùng HabitFlow'}
              </Text>
              <Ionicons name="create-outline" size={16} color={colors.textSecondary} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          )}

          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {currentUser?.email || 'user@habitflow.app'}
          </Text>
        </View>

        {/* Cài đặt Giao diện */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Giao diện</Text>
          <View
            style={[
              styles.settingsCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              shadow.soft,
            ]}
          >
            <View style={styles.settingsRow}>
              <View style={styles.rowLeft}>
                <View style={[styles.rowIcon, { backgroundColor: colors.surfaceSubtle }]}>
                  <Ionicons
                    name={isDarkMode ? 'moon' : 'sunny'}
                    size={20}
                    color={isDarkMode ? '#FBC02D' : colors.primary}
                  />
                </View>
                <Text style={[styles.rowLabel, { color: colors.text }]}>Chế độ nền tối (Dark Mode)</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>
        </View>

        {/* Cài đặt Thông báo */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Thông báo nhắc nhở</Text>
          <View
            style={[
              styles.settingsCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              shadow.soft,
            ]}
          >
            <View style={styles.settingsRow}>
              <View style={styles.rowLeft}>
                <View style={[styles.rowIcon, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="notifications-outline" size={20} color={colors.primary} />
                </View>
                <Text style={[styles.rowLabel, { color: colors.text }]}>Bật thông báo ứng dụng</Text>
              </View>
              <Switch
                value={notificationEnabled}
                onValueChange={setNotificationEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colors.divider }]} />

            <View style={styles.settingsRow}>
              <View style={styles.rowLeft}>
                <View style={[styles.rowIcon, { backgroundColor: colors.surfaceSubtle }]}>
                  <Ionicons name="time-outline" size={20} color={colors.textSecondary} />
                </View>
                <Text style={[styles.rowLabel, { color: colors.text }]}>Giờ nhắc mặc định</Text>
              </View>
              <TextInput
                style={[
                  styles.timeBox,
                  { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text },
                ]}
                value={defaultTime}
                onChangeText={(val) => {
                  setDefaultTime(val);
                  updateProfile({ defaultReminderTime: val });
                }}
              />
            </View>
          </View>
        </View>

        {/* Quản lý dữ liệu */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Dữ liệu & Sao lưu</Text>
          <View
            style={[
              styles.settingsCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              shadow.soft,
            ]}
          >
            {/* Xuất dữ liệu */}
            <TouchableOpacity onPress={handleExportData} style={styles.settingsRow}>
              <View style={styles.rowLeft}>
                <View style={[styles.rowIcon, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="cloud-upload-outline" size={20} color={colors.primary} />
                </View>
                <Text style={[styles.rowLabel, { color: colors.text }]}>Xuất dữ liệu dự phòng (JSON)</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.divider }]} />

            {/* Nhập dữ liệu */}
            <TouchableOpacity onPress={handleImportData} style={styles.settingsRow}>
              <View style={styles.rowLeft}>
                <View style={[styles.rowIcon, { backgroundColor: colors.surfaceSubtle }]}>
                  <Ionicons name="cloud-download-outline" size={20} color={colors.textSecondary} />
                </View>
                <Text style={[styles.rowLabel, { color: colors.text }]}>Khôi phục từ tệp sao lưu</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.divider }]} />

            {/* Xóa toàn bộ dữ liệu */}
            <TouchableOpacity onPress={handleResetData} style={styles.settingsRow}>
              <View style={styles.rowLeft}>
                <View style={[styles.rowIcon, { backgroundColor: '#FFEBEE' }]}>
                  <Ionicons name="trash-outline" size={20} color={colors.danger} />
                </View>
                <Text style={[styles.rowLabel, { color: colors.danger }]}>Xóa toàn bộ dữ liệu thói quen</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <CustomButton
          title="Đăng xuất tài khoản"
          variant="outline"
          icon="log-out-outline"
          onPress={handleLogout}
          style={styles.logoutBtn}
        />

        <Text style={[styles.versionText, { color: colors.textMuted }]}>
          HabitFlow v1.0.0 — Bản dựng hoàn hảo dành cho bạn 🌿
        </Text>
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
  },
  profileCard: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    ...typography.h3,
    fontSize: 18,
    fontWeight: '700',
  },
  editNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  nameInput: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    fontSize: 16,
    fontWeight: '600',
    minWidth: 160,
    textAlign: 'center',
  },
  saveNameBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userEmail: {
    ...typography.bodySmall,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.label,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  settingsCard: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowLabel: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginHorizontal: spacing.md,
  },
  timeBox: {
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 13,
    fontWeight: '700',
    minWidth: 70,
    textAlign: 'center',
  },
  logoutBtn: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  versionText: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
