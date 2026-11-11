import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';
import { CustomButton } from './CustomButton';
import { borderRadius, shadow, spacing, typography } from '../theme';

interface NoteModalProps {
  visible: boolean;
  habitTitle: string;
  initialNote?: string;
  onClose: () => void;
  onSave: (note: string) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  visible,
  habitTitle,
  initialNote = '',
  onClose,
  onSave,
}) => {
  const { colors } = useThemeStore();
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    setNote(initialNote);
  }, [initialNote, visible]);

  const quickMoods = ['🎉 Tuyệt vời', '⚡ Đầy năng lượng', '🌱 Tiến bộ từng chút', '😌 Thư thái', '💪 Vượt lười'];

  const handleAddMood = (mood: string) => {
    setNote((prev) => (prev ? `${prev} - ${mood}` : mood));
  };

  const handleSave = () => {
    onSave(note);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <TouchableOpacity activeOpacity={1} style={styles.overlay} onPress={onClose} />

        <View
          style={[
            styles.modalContent,
            { backgroundColor: colors.card, borderColor: colors.border },
            shadow.float,
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="document-text-outline" size={20} color={colors.primary} />
              <Text style={[styles.title, { color: colors.text }]}>Nhật ký thói quen</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subTitle, { color: colors.textSecondary }]}>
            Cho thói quen: <Text style={{ fontWeight: '700', color: colors.text }}>{habitTitle}</Text>
          </Text>

          {/* Quick mood suggestions */}
          <View style={styles.moodRow}>
            {quickMoods.map((m, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleAddMood(m)}
                style={[styles.moodTag, { backgroundColor: colors.surfaceSubtle }]}
              >
                <Text style={[styles.moodText, { color: colors.textSecondary }]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Input note */}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Viết cảm nghĩ, kết quả hoặc nhật ký thực hiện hôm nay..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            value={note}
            onChangeText={setNote}
            textAlignVertical="top"
          />

          {/* Actions */}
          <View style={styles.actionRow}>
            <CustomButton
              title="Hủy"
              variant="ghost"
              onPress={onClose}
              style={{ flex: 1, marginRight: spacing.sm }}
            />
            <CustomButton
              title="Lưu ghi chú"
              variant="primary"
              onPress={handleSave}
              style={{ flex: 1.5 }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.h3,
    fontSize: 18,
  },
  subTitle: {
    ...typography.bodySmall,
    marginBottom: spacing.md,
  },
  closeBtn: {
    padding: 4,
  },
  moodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.md,
  },
  moodTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  moodText: {
    fontSize: 11,
    fontWeight: '500',
  },
  input: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.md,
    height: 100,
    fontSize: 14,
    marginBottom: spacing.lg,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
