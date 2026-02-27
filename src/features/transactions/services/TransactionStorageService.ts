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
      const parsed = JSON.parse(raw) as Partial<Transaction>[];
      // Backward-compatible normalization for persisted records created before ridesCount existed.
      return parsed.map((item) => ({
        id: item.id || `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        type: item.type === 'expense' ? 'expense' : 'income',
        amount: Number(item.amount) || 0,
        ridesCount: Math.max(0, Number(item.ridesCount) || 0),
        category: item.category || 'Sem categoria',
        date: item.date || new Date().toISOString().slice(0, 10),
        description: item.description?.trim() || undefined
      }));
    } catch {
      return [];
    }
  }

  async save(transactions: Transaction[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }
}
