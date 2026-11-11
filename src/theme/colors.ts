export const PALETTE = {
  sage50: '#F4F9F5',
  sage100: '#E8F3EB',
  sage200: '#D2E8D7',
  sage300: '#B0D7B9',
  sage400: '#84BF93',
  sage500: '#5DB075', // Brand Primary - Light fresh sage
  sage600: '#47955D',
  sage700: '#38784B',
  sage800: '#2F5F3E',
  sage900: '#274E34',

  white: '#FFFFFF',
  black: '#000000',
  charcoal: '#1B241E',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
};

export const HABIT_COLOR_OPTIONS = [
  '#5DB075', // Sage Green
  '#4E9F8E', // Mint Teal
  '#3B82F6', // Ocean Blue
  '#8B5CF6', // Soft Violet
  '#EC4899', // Rosy Pink
  '#F59E0B', // Amber
  '#EF4444', // Coral Red
  '#10B981', // Emerald
  '#6366F1', // Indigo
  '#14B8A6', // Aqua
];

export const HABIT_ICON_OPTIONS = [
  'book-outline',
  'fitness-outline',
  'water-outline',
  'walk-outline',
  'bed-outline',
  'heart-outline',
  'bulb-outline',
  'nutrition-outline',
  'leaf-outline',
  'timer-outline',
  'musical-notes-outline',
  'pencil-outline',
  'happy-outline',
  'bicycle-outline',
  'cafe-outline',
  'alarm-outline',
];

export interface ThemeColors {
  mode: 'light' | 'dark';
  primary: string;
  primaryLight: string;
  primarySoft: string;
  primaryDark: string;
  accent: string;
  background: string;
  card: string;
  cardSecondary: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderFocus: string;
  divider: string;
  surface: string;
  surfaceSubtle: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  shadowColor: string;
}

export const lightColors: ThemeColors = {
  mode: 'light',
  primary: '#5DB075',
  primaryLight: '#E8F5EC',
  primarySoft: '#D7EDE0',
  primaryDark: '#43925B',
  accent: '#4AA08B',
  background: '#F7FAF8',
  card: '#FFFFFF',
  cardSecondary: '#F2F6F3',
  text: '#17271E',
  textSecondary: '#5A6F62',
  textMuted: '#96A99D',
  border: '#E1EBE4',
  borderFocus: '#5DB075',
  divider: '#EDF3EF',
  surface: '#FFFFFF',
  surfaceSubtle: '#F0F6F2',
  success: '#4CAF50',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  shadowColor: '#17271E',
};

export const darkColors: ThemeColors = {
  mode: 'dark',
  primary: '#6EC588',
  primaryLight: '#1B3124',
  primarySoft: '#244030',
  primaryDark: '#53A86D',
  accent: '#59B8A0',
  background: '#111A15',
  card: '#1A2620',
  cardSecondary: '#213028',
  text: '#EDF5EF',
  textSecondary: '#9CB0A3',
  textMuted: '#687E71',
  border: '#27382E',
  borderFocus: '#6EC588',
  divider: '#202D25',
  surface: '#1A2620',
  surfaceSubtle: '#223229',
  success: '#66BB6A',
  warning: '#FBBF24',
  danger: '#F87171',
  info: '#60A5FA',
  shadowColor: '#000000',
};
