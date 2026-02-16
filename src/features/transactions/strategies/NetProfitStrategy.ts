import { CalculationStrategy } from '@/features/transactions/strategies/CalculationStrategy';
import { TotalExpenseStrategy } from '@/features/transactions/strategies/TotalExpenseStrategy';
import { TotalIncomeStrategy } from '@/features/transactions/strategies/TotalIncomeStrategy';
import { Transaction } from '@/features/transactions/types/transaction';

export class NetProfitStrategy implements CalculationStrategy {
  private readonly incomeStrategy = new TotalIncomeStrategy();

  private readonly expenseStrategy = new TotalExpenseStrategy();

  calculate(transactions: Transaction[]): number {
    return this.incomeStrategy.calculate(transactions) - this.expenseStrategy.calculate(transactions);
  }
}