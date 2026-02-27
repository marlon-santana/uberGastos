import { Transaction } from '@/features/transactions/types/transaction';
import { parseISODateLocal } from '@/shared/utils/format';

const DAY_MS = 24 * 60 * 60 * 1000;

export const filterWeeklyTransactions = (transactions: Transaction[]): Transaction[] => {
  const now = new Date();
  const lowerBound = new Date(now.getTime() - 7 * DAY_MS);
  return transactions.filter((transaction) => parseISODateLocal(transaction.date) >= lowerBound);
};

export const filterMonthlyTransactions = (transactions: Transaction[]): Transaction[] => {
  const now = new Date();
  return transactions.filter((transaction) => {
    const date = parseISODateLocal(transaction.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
};
