export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  ridesCount: number;
  category: string;
  date: string;
  description?: string;
}

export interface TransactionInput {
  amount: number;
  ridesCount: number;
  category: string;
  date: string;
  description?: string;
}
