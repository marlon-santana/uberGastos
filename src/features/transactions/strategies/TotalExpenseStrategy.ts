import { CalculationStrategy } from '@/features/transactions/strategies/CalculationStrategy';
import { Transaction } from '@/features/transactions/types/transaction';

export class TotalExpenseStrategy implements CalculationStrategy {
  calculate(transactions: Transaction[]): number {
    return transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }
}