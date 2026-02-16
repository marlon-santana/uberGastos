import { CalculationStrategy } from '@/features/transactions/strategies/CalculationStrategy';
import { Transaction } from '@/features/transactions/types/transaction';

export class TotalIncomeStrategy implements CalculationStrategy {
  calculate(transactions: Transaction[]): number {
    return transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + transaction.amount, 0);
  }
}