import { CalculationStrategy } from '@/features/transactions/strategies/CalculationStrategy';
import { filterMonthlyTransactions } from '@/features/transactions/strategies/dateFilters';
import { Transaction } from '@/features/transactions/types/transaction';

export class MonthlyStrategy implements CalculationStrategy {
  calculate(transactions: Transaction[]): number {
    return filterMonthlyTransactions(transactions).reduce((total, transaction) => total + transaction.amount, 0);
  }
}
