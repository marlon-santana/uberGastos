import React, { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { TransactionFactory } from '@/features/transactions/factory/TransactionFactory';
import { TransactionStorageService } from '@/features/transactions/services/TransactionStorageService';
import { Transaction, TransactionInput, TransactionType } from '@/features/transactions/types/transaction';

interface TransactionsContextValue {
  transactions: Transaction[];
  loading: boolean;
  addTransaction: (type: TransactionType, input: TransactionInput) => Promise<void>;
  clearTransactions: () => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextValue | undefined>(undefined);

const storageService = new TransactionStorageService();

export function TransactionsProvider({ children }: PropsWithChildren) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        const stored = await storageService.load();
        if (mounted) {
          setTransactions(stored);
        }
      } catch (error) {
        console.error('Failed to load transactions', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    hydrate();

    return () => {
      mounted = false;
    };
  }, []);

  const addTransaction = useCallback(async (type: TransactionType, input: TransactionInput) => {
    const next = [TransactionFactory.create(type, input), ...transactions];
    await storageService.save(next);
    setTransactions(next);
  }, [transactions]);

  const clearTransactions = useCallback(async () => {
    await storageService.save([]);
    setTransactions([]);
  }, []);

  const value = useMemo(
    () => ({
      transactions,
      loading,
      addTransaction,
      clearTransactions
    }),
    [transactions, loading, addTransaction, clearTransactions]
  );

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}

export { TransactionsContext };
