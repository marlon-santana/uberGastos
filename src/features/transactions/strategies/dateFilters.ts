import { Transaction } from '@/features/transactions/types/transaction';

const DAY_MS = 24 * 60 * 60 * 1000;

export const filterWeeklyTransactions = (transactions: Transaction[]): Transaction[] => {
  const now = new Date();
  const lowerBound = new Date(now.getTime() - 7 * DAY_MS);
  return transactions.filter((transaction) => new Date(transaction.date) >= lowerBound);
};

export const filterMonthlyTransactions = (transactions: Transaction[]): Transaction[] => {
  const now = new Date();
  return transactions.filter((transaction) => {
    const date = new Date(transaction.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
};