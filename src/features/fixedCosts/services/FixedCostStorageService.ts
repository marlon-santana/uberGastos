import AsyncStorage from '@react-native-async-storage/async-storage';
import { FixedCost } from '@/features/fixedCosts/types/fixedCost';

const STORAGE_KEY = '@drivercash:fixedCosts';

export class FixedCostStorageService {
  async load(): Promise<FixedCost[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as FixedCost[];
    } catch {
      return [];
    }
  }

  async save(fixedCosts: FixedCost[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fixedCosts));
  }
}
