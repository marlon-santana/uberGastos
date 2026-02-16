import React, { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { FixedCostFactory } from '@/features/fixedCosts/factory';
import { FixedCostStorageService } from '@/features/fixedCosts/services';
import { FixedCost, FixedCostInput } from '@/features/fixedCosts/types';

interface FixedCostsContextValue {
  fixedCosts: FixedCost[];
  loading: boolean;
  addFixedCost: (input: FixedCostInput) => Promise<void>;
  deleteFixedCost: (id: string) => Promise<void>;
  totalDailyAmount: number;
}

const FixedCostsContext = createContext<FixedCostsContextValue | undefined>(undefined);

const storageService = new FixedCostStorageService();

export function FixedCostsProvider({ children }: PropsWithChildren) {
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      const stored = await storageService.load();
      if (mounted) {
        setFixedCosts(stored);
        setLoading(false);
      }
    };

    hydrate();

    return () => {
      mounted = false;
    };
  }, []);

  const addFixedCost = useCallback(async (input: FixedCostInput) => {
    setFixedCosts(prev => {
      const next = [FixedCostFactory.create(input), ...prev];
      storageService.save(next);
      return next;
    });
  }, []);

  const deleteFixedCost = useCallback(async (id: string) => {
    setFixedCosts(prev => {
      const next = prev.filter(cost => cost.id !== id);
      storageService.save(next);
      return next;
    });
  }, []);

  const totalDailyAmount = useMemo(() => {
    return fixedCosts.reduce((sum, cost) => sum + cost.dailyAmount, 0);
  }, [fixedCosts]);

  const value = useMemo(
    () => ({
      fixedCosts,
      loading,
      addFixedCost,
      deleteFixedCost,
      totalDailyAmount
    }),
    [fixedCosts, loading, addFixedCost, deleteFixedCost, totalDailyAmount]
  );

  return <FixedCostsContext.Provider value={value}>{children}</FixedCostsContext.Provider>;
}

export { FixedCostsContext };
