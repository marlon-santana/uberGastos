import { Transaction } from '@/features/transactions/types/transaction';
import { parseISODateLocal } from '@/shared/utils/format';

const DAY_MS = 24 * 60 * 60 * 1000;

export const filterWeeklyTransactions = (transactions: Transaction[]): Transaction[] => {
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayOfWeek = todayMidnight.getDay(); // 0 = Domingo .. 6 = Sábado
  const lowerBound = new Date(todayMidnight.getTime() - dayOfWeek * DAY_MS); // domingo desta semana
  const upperBound = new Date(lowerBound.getTime() + 7 * DAY_MS); // próximo domingo (exclusivo)
  return transactions.filter((transaction) => {
    const date = parseISODateLocal(transaction.date);
    return date >= lowerBound && date < upperBound;
  });
};

export const filterMonthlyTransactions = (transactions: Transaction[]): Transaction[] => {
  const now = new Date();
  return transactions.filter((transaction) => {
    const date = parseISODateLocal(transaction.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
};
