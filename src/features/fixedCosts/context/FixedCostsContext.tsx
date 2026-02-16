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
    const next = [FixedCostFactory.create(input), ...fixedCosts];
    await storageService.save(next);
    setFixedCosts(next);
  }, [fixedCosts]);

  const deleteFixedCost = useCallback(async (id: string) => {
    const next = fixedCosts.filter(cost => cost.id !== id);
    await storageService.save(next);
    setFixedCosts(next);
  }, [fixedCosts]);

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
