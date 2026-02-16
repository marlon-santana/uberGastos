import { CalculationStrategy } from '@/features/transactions/strategies/CalculationStrategy';
import { filterWeeklyTransactions } from '@/features/transactions/strategies/dateFilters';
import { Transaction } from '@/features/transactions/types/transaction';

export class WeeklyStrategy implements CalculationStrategy {
  calculate(transactions: Transaction[]): number {
    return filterWeeklyTransactions(transactions).reduce((total, transaction) => total + transaction.amount, 0);
  }
}
