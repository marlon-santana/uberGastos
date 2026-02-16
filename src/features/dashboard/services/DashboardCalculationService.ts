import { CalculationStrategy } from '@/features/transactions/strategies/CalculationStrategy';
import { Transaction } from '@/features/transactions/types';

export class DashboardCalculationService {
  constructor(private readonly strategy: CalculationStrategy) {}

  execute(transactions: Transaction[]): number {
    return this.strategy.calculate(transactions);
  }
}