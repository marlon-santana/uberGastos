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
import { parseISODateLocal, toISODate } from "@/shared/utils/format";

const DAY_MS = 24 * 60 * 60 * 1000;

function daysUntil(dateStr: string): number {
  const target = parseISODateLocal(dateStr).getTime();
  const now = Date.now();
  return Math.max(Math.ceil((target - now) / DAY_MS), 1);
}

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
      try {
        const stored = await storageService.load();
        if (mounted) {
          setFixedCosts(stored);
        }
      } catch (error) {
        console.error('Failed to hydrate fixed costs', error);
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
            { date: toISODate(), amount },
          ];
          // Recalcular valor diário com base nos dias reais até a data final
          const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
          const remaining = Math.max(cost.value - totalPaid, 0);
          const daysLeft = daysUntil(cost.endDate);
          const dailyAmount = remaining / daysLeft;
          return {
            ...cost,
            payments,
            dailyAmount,
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
        // Inicia um novo ciclo a partir de hoje, recalculando a data final
        const dailyAmount = cost.value / cost.daysToPayoff;
        const newStartDate = new Date();
        const newEndDate = new Date(newStartDate);
        newEndDate.setDate(newEndDate.getDate() + cost.daysToPayoff);
        return {
          ...cost,
          payments: [],
          dailyAmount,
          startDate: toISODate(newStartDate),
          endDate: toISODate(newEndDate),
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
