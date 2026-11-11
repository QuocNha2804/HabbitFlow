import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { useHabitStore } from '../store/useHabitStore';
import { CustomButton } from '../components/CustomButton';
import { HABIT_COLOR_OPTIONS, HABIT_ICON_OPTIONS } from '../theme/colors';
import { FrequencyType } from '../types';
import { borderRadius, shadow, spacing, typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AddHabitModal'>;

export const AddHabitModal: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useThemeStore();
  const { currentUser, defaultReminderTime } = useAuthStore();
  const { addHabit, updateHabit } = useHabitStore();

  const isEdit = route.params?.mode === 'edit';
  const existingHabit = route.params?.habit;

  const [title, setTitle] = useState(existingHabit?.title || '');
  const [description, setDescription] = useState(existingHabit?.description || '');
  const [icon, setIcon] = useState(existingHabit?.icon || 'leaf-outline');
  const [color, setColor] = useState(existingHabit?.color || colors.primary);
  const [frequencyType, setFrequencyType] = useState<FrequencyType>(
    existingHabit?.frequencyType || 'daily'
  );
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(
    existingHabit?.daysOfWeek || [1, 2, 3, 4, 5]
  );
  const [targetCount, setTargetCount] = useState<number>(existingHabit?.targetCount || 1);
  const [unit, setUnit] = useState<string>(existingHabit?.unit || 'lần');
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(
    existingHabit?.reminderEnabled ?? true
  );
  const [reminderTime, setReminderTime] = useState<string>(
    existingHabit?.reminderTime || defaultReminderTime || '08:00'
  );
  const [loading, setLoading] = useState(false);

  const dayLabels = [
    { day: 1, label: 'T2' },
    { day: 2, label: 'T3' },
    { day: 3, label: 'T4' },
    { day: 4, label: 'T5' },
    { day: 5, label: 'T6' },
    { day: 6, label: 'T7' },
    { day: 0, label: 'CN' },
  ];

  const toggleDay = (day: number) => {
    if (daysOfWeek.includes(day)) {
      if (daysOfWeek.length <= 1) {
        Alert.alert('Lưu ý', 'Phải chọn ít nhất 1 ngày trong tuần.');
        return;
      }
      setDaysOfWeek(daysOfWeek.filter((d) => d !== day));
    } else {
      setDaysOfWeek([...daysOfWeek, day]);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên thói quen.');
      return;
    }

    if (frequencyType === 'custom_days' && daysOfWeek.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn ít nhất 1 ngày trong tuần.');
      return;
    }

    if (!currentUser?.id) return;

    setLoading(true);

    try {
      if (isEdit && existingHabit) {
        await updateHabit({
          ...existingHabit,
          title: title.trim(),
          description: description.trim() || undefined,
          icon,
          color,
          frequencyType,
          daysOfWeek: frequencyType === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : daysOfWeek,
          targetCount: Math.max(1, targetCount),
          unit: unit.trim() || 'lần',
          reminderEnabled,
          reminderTime: reminderEnabled ? reminderTime : undefined,
        });
      } else {
        await addHabit({
          userId: currentUser.id,
          title: title.trim(),
          description: description.trim() || undefined,
          icon,
          color,
          frequencyType,
          daysOfWeek: frequencyType === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : daysOfWeek,
          targetCount: Math.max(1, targetCount),
          unit: unit.trim() || 'lần',
          reminderEnabled,
          reminderTime: reminderEnabled ? reminderTime : undefined,
        });
      }

      setLoading(false);
      navigation.goBack();
    } catch (e) {
      setLoading(false);
      Alert.alert('Lỗi', 'Không thể lưu thói quen. Vui lòng thử lại.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        {/* Header Bar */}
        <View style={[styles.headerBar, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {isEdit ? 'Chỉnh sửa thói quen' : 'Thêm thói quen mới'}
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            style={styles.saveHeaderBtn}
          >
            <Text style={[styles.saveHeaderText, { color: colors.primary }]}>Lưu</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Tên & Mô tả */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>Tên thói quen *</Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: colors.card, borderColor: colors.border },
                shadow.soft,
              ]}
            >
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="VD: Đọc sách, Uống nước, Chạy bộ..."
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <Text style={[styles.sectionLabel, { color: colors.text, marginTop: spacing.md }]}>
              Mô tả / Động lực (tùy chọn)
            </Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: colors.card, borderColor: colors.border },
                shadow.soft,
              ]}
            >
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="VD: 15 phút mỗi sáng để minh mẫn hơn"
                placeholderTextColor={colors.textMuted}
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>

          {/* Chọn Icon */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>Biểu tượng (Icon)</Text>
            <View style={styles.iconGrid}>
              {HABIT_ICON_OPTIONS.map((iconName) => {
                const isSelected = icon === iconName;
                return (
                  <TouchableOpacity
                    key={iconName}
                    activeOpacity={0.7}
                    onPress={() => setIcon(iconName)}
                    style={[
                      styles.iconBox,
                      {
                        backgroundColor: isSelected ? `${color}20` : colors.card,
                        borderColor: isSelected ? color : colors.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={iconName as any}
                      size={22}
                      color={isSelected ? color : colors.textSecondary}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Chọn Màu sắc */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>Màu sắc đại diện</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorRow}>
              {HABIT_COLOR_OPTIONS.map((c) => {
                const isSelected = color === c;
                return (
                  <TouchableOpacity
                    key={c}
                    activeOpacity={0.8}
                    onPress={() => setColor(c)}
                    style={[
                      styles.colorDot,
                      { backgroundColor: c },
                      isSelected && styles.colorDotSelected,
                    ]}
                  >
                    {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Tần suất */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>Tần suất lặp lại</Text>
            <View style={[styles.segmentContainer, { backgroundColor: colors.surfaceSubtle }]}>
              <TouchableOpacity
                onPress={() => setFrequencyType('daily')}
                style={[
                  styles.segmentBtn,
                  frequencyType === 'daily' && { backgroundColor: colors.card },
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    {
                      color:
                        frequencyType === 'daily' ? colors.primaryDark : colors.textSecondary,
                    },
                  ]}
                >
                  Hàng ngày (7 ngày)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFrequencyType('custom_days')}
                style={[
                  styles.segmentBtn,
                  frequencyType === 'custom_days' && { backgroundColor: colors.card },
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    {
                      color:
                        frequencyType === 'custom_days'
                          ? colors.primaryDark
                          : colors.textSecondary,
                    },
                  ]}
                >
                  Chọn thứ trong tuần
                </Text>
              </TouchableOpacity>
            </View>

            {frequencyType === 'custom_days' && (
              <View style={styles.daysRow}>
                {dayLabels.map((item) => {
                  const isSelected = daysOfWeek.includes(item.day);
                  return (
                    <TouchableOpacity
                      key={item.day}
                      onPress={() => toggleDay(item.day)}
                      style={[
                        styles.dayCircle,
                        {
                          backgroundColor: isSelected ? color : colors.card,
                          borderColor: isSelected ? color : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayCircleText,
                          { color: isSelected ? '#FFFFFF' : colors.text },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          {/* Mục tiêu trong ngày (targetCount) */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>Mục tiêu mỗi ngày</Text>
            <View style={styles.targetRow}>
              <View style={styles.counterControl}>
                <TouchableOpacity
                  onPress={() => setTargetCount((prev) => Math.max(1, prev - 1))}
                  style={[styles.counterBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <Ionicons name="remove" size={18} color={colors.text} />
                </TouchableOpacity>

                <Text style={[styles.counterNumber, { color: colors.text }]}>{targetCount}</Text>

                <TouchableOpacity
                  onPress={() => setTargetCount((prev) => prev + 1)}
                  style={[styles.counterBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <Ionicons name="add" size={18} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.unitWrapper,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <TextInput
                  style={[styles.unitInput, { color: colors.text }]}
                  placeholder="Đơn vị (cốc, phút...)"
                  placeholderTextColor={colors.textMuted}
                  value={unit}
                  onChangeText={setUnit}
                />
              </View>
            </View>
          </View>

          {/* Thông báo nhắc nhở */}
          <View
            style={[
              styles.sectionCard,
              { backgroundColor: colors.card, borderColor: colors.border },
              shadow.soft,
            ]}
          >
            <View style={styles.reminderHeader}>
              <View style={styles.reminderTitleRow}>
                <Ionicons name="alarm-outline" size={22} color={colors.primary} />
                <View style={{ marginLeft: spacing.sm }}>
                  <Text style={[styles.reminderTitle, { color: colors.text }]}>
                    Nhắc nhở qua thông báo
                  </Text>
                  <Text style={[styles.reminderSub, { color: colors.textSecondary }]}>
                    Gửi thông báo nhắc nhở theo giờ
                  </Text>
                </View>
              </View>
              <Switch
                value={reminderEnabled}
                onValueChange={setReminderEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            {reminderEnabled && (
              <View style={styles.timeSelectRow}>
                <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>Giờ nhắc:</Text>
                <TextInput
                  style={[
                    styles.timeInput,
                    { backgroundColor: colors.surfaceSubtle, borderColor: colors.border, color: colors.text },
                  ]}
                  value={reminderTime}
                  onChangeText={setReminderTime}
                  placeholder="HH:mm (VD: 07:30)"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            )}
          </View>

          {/* Bottom Button */}
          <CustomButton
            title={isEdit ? 'Lưu thay đổi' : 'Tạo thói quen'}
            icon={isEdit ? 'checkmark' : 'add'}
            size="lg"
            loading={loading}
            onPress={handleSave}
            style={styles.bottomBtn}
          />
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  closeBtn: {
    padding: 6,
  },
  headerTitle: {
    ...typography.h3,
    fontSize: 17,
  },
  saveHeaderBtn: {
    padding: 6,
  },
  saveHeaderText: {
    ...typography.label,
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 60,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    ...typography.label,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  inputWrapper: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    height: 48,
    justifyContent: 'center',
  },
  input: {
    fontSize: 15,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: spacing.xs,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorRow: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 4,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: borderRadius.lg,
    padding: 3,
    marginTop: spacing.xs,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  segmentText: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  counterControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  counterBtn: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterNumber: {
    ...typography.h3,
    fontSize: 18,
    minWidth: 28,
    textAlign: 'center',
  },
  unitWrapper: {
    flex: 1,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    height: 44,
    justifyContent: 'center',
  },
  unitInput: {
    fontSize: 14,
  },
  sectionCard: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTitle: {
    ...typography.label,
    fontSize: 14,
  },
  reminderSub: {
    ...typography.caption,
    fontSize: 12,
  },
  timeSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  timeLabel: {
    ...typography.caption,
    fontSize: 13,
  },
  timeInput: {
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    fontSize: 14,
    fontWeight: '700',
    minWidth: 120,
    textAlign: 'center',
  },
  bottomBtn: {
    marginTop: spacing.md,
  },
});
