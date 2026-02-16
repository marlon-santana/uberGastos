import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '@/features/transactions/types/transaction';

const STORAGE_KEY = '@drivercash:transactions';

export class TransactionStorageService {
  async load(): Promise<Transaction[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as Transaction[];
    } catch {
      return [];
    }
  }

  async save(transactions: Transaction[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }
}