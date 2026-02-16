import React, { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { TransactionFactory } from '@/features/transactions/factory/TransactionFactory';
import { TransactionStorageService } from '@/features/transactions/services/TransactionStorageService';
import { Transaction, TransactionInput, TransactionType } from '@/features/transactions/types/transaction';

interface TransactionsContextValue {
  transactions: Transaction[];
  loading: boolean;
  addTransaction: (type: TransactionType, input: TransactionInput) => Promise<void>;
}

const TransactionsContext = createContext<TransactionsContextValue | undefined>(undefined);

const storageService = new TransactionStorageService();

export function TransactionsProvider({ children }: PropsWithChildren) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      const stored = await storageService.load();
      if (mounted) {
        setTransactions(stored);
        setLoading(false);
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

  const value = useMemo(
    () => ({
      transactions,
      loading,
      addTransaction
    }),
    [transactions, loading, addTransaction]
  );

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}

export { TransactionsContext };
