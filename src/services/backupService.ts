import { Platform, Share } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Habit, HabitLog } from '../types';

export interface BackupData {
  version: string;
  exportedAt: string;
  userId: string;
  habits: Habit[];
  habitLogs: HabitLog[];
}

export const backupService = {
  async exportData(userId: string, habits: Habit[], habitLogs: HabitLog[]): Promise<boolean> {
    try {
      const backup: BackupData = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        userId,
        habits,
        habitLogs,
      };

      const jsonString = JSON.stringify(backup, null, 2);

      // Nếu trên web hoặc nếu sharing file không khả dụng -> dùng Share native text
      if (Platform.OS === 'web') {
        await Share.share({
          title: 'HabitFlow_Backup.json',
          message: jsonString,
        });
        return true;
      }

      // Trên iOS / Android: ghi ra file tạm rồi mở Sharing dialog
      const fileName = `HabitFlow_Backup_${Date.now()}.json`;
      const fileUri = `${FileSystem.documentDirectory || FileSystem.cacheDirectory || ''}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Xuất dữ liệu HabitFlow',
          UTI: 'public.json',
        });
        return true;
      } else {
        await Share.share({
          title: 'HabitFlow Backup',
          message: jsonString,
        });
        return true;
      }
    } catch (error) {
      console.warn('[backupService] Export error:', error);
      return false;
    }
  },

  async importData(): Promise<BackupData | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/json', 'text/json', '*/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || !result.assets[0]) {
        return null;
      }

      const file = result.assets[0];
      const content = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const parsed = JSON.parse(content);
      if (parsed && Array.isArray(parsed.habits) && Array.isArray(parsed.habitLogs)) {
        return parsed as BackupData;
      }
      return null;
    } catch (error) {
      console.warn('[backupService] Import error:', error);
      return null;
    }
  },
};
