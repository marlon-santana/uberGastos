import { Transaction } from '@/features/transactions/types/transaction';

export interface CalculationStrategy {
  calculate(transactions: Transaction[]): number;
}