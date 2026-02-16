import { useContext } from 'react';
import { TransactionsContext } from '@/features/transactions/context/TransactionsContext';

export const useTransactions = () => {
  const context = useContext(TransactionsContext);

  if (!context) {
    throw new Error('useTransactions must be used within TransactionsProvider');
  }

  return context;
};