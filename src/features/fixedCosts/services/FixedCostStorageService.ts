import AsyncStorage from '@react-native-async-storage/async-storage';
import { FixedCost } from '@/features/fixedCosts/types';

const STORAGE_KEY = '@DriverCash:fixedCosts';

export class FixedCostStorageService {
  async load(): Promise<FixedCost[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error('Failed to load fixed costs', error);
      return [];
    }
  }

  async save(costs: FixedCost[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(costs));
    } catch (error) {
      console.error('Failed to save fixed costs', error);
    }
  }
}
