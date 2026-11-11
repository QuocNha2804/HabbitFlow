import { NavigatorScreenParams } from '@react-navigation/native';
import { Habit } from '../types';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<TabParamList>;
  AddHabitModal: {
    mode: 'create' | 'edit';
    habit?: Habit;
  };
  HabitDetailModal: {
    habitId: string;
  };
};

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type TabParamList = {
  Home: undefined;
  Stats: undefined;
  Calendar: undefined;
  Profile: undefined;
};
