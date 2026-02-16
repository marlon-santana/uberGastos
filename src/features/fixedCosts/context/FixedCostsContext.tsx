import React, { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { FixedCostFactory } from '@/features/fixedCosts/factory/FixedCostFactory';
import { FixedCostStorageService } from '@/features/fixedCosts/services/FixedCostStorageService';
import { FixedCost, FixedCostInput } from '@/features/fixedCosts/types/fixedCost';

interface FixedCostsContextValue {
  fixedCosts: FixedCost[];
  loading: boolean;
  addFixedCost: (input: FixedCostInput) => Promise<void>;
  removeFixedCost: (id: string) => Promise<void>;
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

  const removeFixedCost = useCallback(async (id: string) => {
    const next = fixedCosts.filter(cost => cost.id !== id);
    await storageService.save(next);
    setFixedCosts(next);
  }, [fixedCosts]);

  const value = useMemo(
    () => ({
      fixedCosts,
      loading,
      addFixedCost,
      removeFixedCost
    }),
    [fixedCosts, loading, addFixedCost, removeFixedCost]
  );

  return <FixedCostsContext.Provider value={value}>{children}</FixedCostsContext.Provider>;
}

export { FixedCostsContext };
