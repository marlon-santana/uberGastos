import { Period } from '@/shared/types/common';
import { filterMonthlyTransactions, filterWeeklyTransactions } from '@/features/transactions/strategies';
import { Transaction } from '@/features/transactions/types';

export interface PeriodStrategy {
  filter(transactions: Transaction[]): Transaction[];
}

class WeeklyPeriodStrategy implements PeriodStrategy {
  filter(transactions: Transaction[]): Transaction[] {
    return filterWeeklyTransactions(transactions);
  }
}

class MonthlyPeriodStrategy implements PeriodStrategy {
  filter(transactions: Transaction[]): Transaction[] {
    return filterMonthlyTransactions(transactions);
  }
}

export class PeriodStrategyFactory {
  static create(period: Period): PeriodStrategy {
    if (period === 'weekly') {
      return new WeeklyPeriodStrategy();
    }

    return new MonthlyPeriodStrategy();
  }
}