import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';
import { AddHabitModal } from '../screens/AddHabitModal';
import { HabitDetailModal } from '../screens/HabitDetailModal';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { currentUser, isLoading } = useAuthStore();
  const { colors } = useThemeStore();

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.logoCircle, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="leaf" size={42} color={colors.primary} />
        </View>
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 24 }} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {currentUser ? (
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}

      {/* Shared Modals */}
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      >
        <Stack.Screen name="AddHabitModal" component={AddHabitModal} />
        <Stack.Screen name="HabitDetailModal" component={HabitDetailModal} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
