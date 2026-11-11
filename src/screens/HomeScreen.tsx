import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/useAuthStore';
import { useHabitStore } from '../store/useHabitStore';
import { Header } from '../components/Header';
import { WeekStrip } from '../components/WeekStrip';
import { ProgressCircle } from '../components/ProgressCircle';
import { FilterTabs } from '../components/FilterTabs';
import { HabitCard } from '../components/HabitCard';
import { NoteModal } from '../components/NoteModal';
import { EmptyState } from '../components/EmptyState';
import { formatDateKey } from '../utils/dateHelpers';
import { Habit } from '../types';
import { borderRadius, shadow, spacing } from '../theme';

export const HomeScreen: React.FC = () => {
  const { colors } = useThemeStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { currentUser } = useAuthStore();
  const {
    habits,
    habitLogs,
    activeDateKey,
    setActiveDateKey,
    filter,
    setFilter,
    loadUserData,
    toggleHabit,
    incrementHabit,
    deleteHabit,
    saveNote,
    getScheduledHabitsForDate,
    getHabitLog,
  } = useHabitStore();

  const [refreshing, setRefreshing] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [selectedHabitForNote, setSelectedHabitForNote] = useState<Habit | null>(null);

  // Load user habits & logs on mount / when currentUser changes
  useEffect(() => {
    if (currentUser?.id) {
      loadUserData(currentUser.id);
    }
  }, [currentUser?.id]);

  const onRefresh = async () => {
    if (currentUser?.id) {
      setRefreshing(true);
      await loadUserData(currentUser.id);
      setRefreshing(false);
    }
  };

  // Lấy các thói quen có lịch vào ngày đang chọn
  const scheduledHabits = useMemo(() => {
    return getScheduledHabitsForDate(activeDateKey);
  }, [habits, activeDateKey]);

  // Bộ lọc: all, pending, completed
  const counts = useMemo(() => {
    let completedCount = 0;
    scheduledHabits.forEach((h) => {
      const log = getHabitLog(h.id, activeDateKey);
      if (log?.completed) completedCount++;
    });
    return {
      all: scheduledHabits.length,
      pending: scheduledHabits.length - completedCount,
      completed: completedCount,
    };
  }, [scheduledHabits, habitLogs, activeDateKey]);

  const displayedHabits = useMemo(() => {
    return scheduledHabits.filter((h) => {
      const log = getHabitLog(h.id, activeDateKey);
      const isDone = log?.completed || false;
      if (filter === 'pending') return !isDone;
      if (filter === 'completed') return isDone;
      return true;
    });
  }, [scheduledHabits, habitLogs, activeDateKey, filter]);

  // Dates with completions for WeekStrip dots
  const completedDateSet = useMemo(() => {
    const set = new Set<string>();
    habitLogs.forEach((l) => {
      if (l.completed) set.add(l.date);
    });
    return set;
  }, [habitLogs]);

  const handleDeleteHabit = (habit: Habit) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa thói quen "${habit.title}" không? Toàn bộ lịch nhắc và dữ liệu liên quan sẽ bị xóa.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa vĩnh viễn',
          style: 'destructive',
          onPress: () => deleteHabit(habit.id),
        },
      ]
    );
  };

  const handleOpenNoteModal = (habit: Habit) => {
    setSelectedHabitForNote(habit);
    setNoteModalVisible(true);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Header onAvatarPress={() => navigation.navigate('Main', { screen: 'Profile' } as any)} />

      <FlatList
        data={displayedHabits}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* WeekStrip */}
            <WeekStrip
              selectedDateKey={activeDateKey}
              onSelectDate={setActiveDateKey}
              completedDates={completedDateSet}
            />

            {/* Progress Circle Card */}
            <ProgressCircle completed={counts.completed} total={counts.all} />

            {/* Filter Chips */}
            <FilterTabs
              currentFilter={filter}
              onSelect={setFilter}
              counts={counts}
            />
          </>
        }
        renderItem={({ item }) => {
          const log = getHabitLog(item.id, activeDateKey);
          return (
            <HabitCard
              habit={item}
              log={log}
              allLogs={habitLogs}
              dateKey={activeDateKey}
              onToggle={() => toggleHabit(item.id, activeDateKey)}
              onIncrement={() => incrementHabit(item.id, activeDateKey)}
              onPress={() => navigation.navigate('HabitDetailModal', { habitId: item.id })}
              onEdit={() => navigation.navigate('AddHabitModal', { mode: 'edit', habit: item })}
              onDelete={() => handleDeleteHabit(item)}
              onAddNote={() => handleOpenNoteModal(item)}
            />
          );
        }}
        ListEmptyComponent={
          <EmptyState
            title={
              filter === 'completed'
                ? 'Chưa hoàn thành thói quen nào'
                : filter === 'pending'
                ? 'Tuyệt vời! Không còn việc tồn'
                : 'Chưa có thói quen cho ngày này'
            }
            description={
              filter === 'all'
                ? 'Hãy bấm vào nút dấu cộng bên dưới để tạo thói quen đầu tiên.'
                : 'Bạn có thể chuyển bộ lọc hoặc tích cực hoàn thành thêm thói quen nhé!'
            }
            actionText={filter === 'all' ? 'Tạo thói quen ngay' : undefined}
            onAction={
              filter === 'all'
                ? () => navigation.navigate('AddHabitModal', { mode: 'create' })
                : undefined
            }
          />
        }
      />

      {/* Floating Action Button (+) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('AddHabitModal', { mode: 'create' })}
        style={[
          styles.fab,
          { backgroundColor: colors.primary },
          shadow.float,
        ]}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Note Modal */}
      {selectedHabitForNote && (
        <NoteModal
          visible={noteModalVisible}
          habitTitle={selectedHabitForNote.title}
          initialNote={getHabitLog(selectedHabitForNote.id, activeDateKey)?.note}
          onClose={() => setNoteModalVisible(false)}
          onSave={(noteText) => saveNote(selectedHabitForNote.id, noteText, activeDateKey)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 90,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xxl,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
