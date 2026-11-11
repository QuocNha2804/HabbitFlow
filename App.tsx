import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useThemeStore } from './src/store/useThemeStore';
import { useAuthStore } from './src/store/useAuthStore';

export default function App() {
  const { isDarkMode, loadTheme, colors } = useThemeStore();
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    loadTheme();
    initializeAuth();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
