import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FixedCostFactory } from "@/features/fixedCosts/factory";
import { FixedCostStorageService } from "@/features/fixedCosts/services";
import { FixedCost, FixedCostInput } from "@/features/fixedCosts/types";

interface FixedCostsContextValue {
  fixedCosts: FixedCost[];
  loading: boolean;
  addFixedCost: (input: FixedCostInput) => Promise<void>;
  deleteFixedCost: (id: string) => Promise<void>;
  addPaymentToFixedCost: (id: string, amount: number) => Promise<void>;
  resetFixedCostPayments: (id: string) => Promise<void>;
  totalDailyAmount: number;
}

const FixedCostsContext = createContext<FixedCostsContextValue | undefined>(
  undefined,
);

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
    setFixedCosts((prev) => {
      const next = [FixedCostFactory.create(input), ...prev];
      storageService.save(next);
      return next;
    });
  }, []);

  const addPaymentToFixedCost = useCallback(
    async (id: string, amount: number) => {
      setFixedCosts((prev) => {
        const next = prev.map((cost) => {
          if (cost.id !== id) return cost;
          const payments = [
            ...(cost.payments || []),
            { date: new Date().toISOString().split("T")[0], amount },
          ];
          // Recalcular valor diário e dias restantes
          const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
          const remaining = cost.value - totalPaid;
          const paymentsCount = payments.length;
          const daysLeft = Math.max(cost.daysToPayoff - paymentsCount, 1);
          const dailyAmount = remaining / daysLeft;
          return {
            ...cost,
            payments,
            dailyAmount: dailyAmount > 0 ? dailyAmount : 0,
          };
        });
        storageService.save(next);
        return next;
      });
    },
    [],
  );

  const deleteFixedCost = useCallback(async (id: string) => {
    setFixedCosts((prev) => {
      const next = prev.filter((cost) => cost.id !== id);
      storageService.save(next);
      return next;
    });
  }, []);

  const resetFixedCostPayments = useCallback(async (id: string) => {
    setFixedCosts((prev) => {
      const next = prev.map((cost) => {
        if (cost.id !== id) return cost;
        // Recalcular o valor diário original
        const dailyAmount = cost.value / cost.daysToPayoff;
        return {
          ...cost,
          payments: [],
          dailyAmount,
        };
      });
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
      addPaymentToFixedCost,
      resetFixedCostPayments,
      totalDailyAmount,
    }),
    [
      fixedCosts,
      loading,
      addFixedCost,
      deleteFixedCost,
      addPaymentToFixedCost,
      resetFixedCostPayments,
      totalDailyAmount,
    ],
  );

  return (
    <FixedCostsContext.Provider value={value}>
      {children}
    </FixedCostsContext.Provider>
  );
}

export { FixedCostsContext };
