import { Transaction, TransactionInput, TransactionType } from '@/features/transactions/types/transaction';

export class TransactionFactory {
  static create(type: TransactionType, data: TransactionInput): Transaction {
    return {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      type,
      amount: data.amount,
      ridesCount: Math.max(0, Math.floor(data.ridesCount)),
      category: data.category,
      date: data.date,
      description: data.description?.trim() || undefined
    };
  }
}
