import React, { createContext, PropsWithChildren, useMemo, useState } from 'react';
import { Period } from '@/shared/types/common';

interface DashboardContextValue {
  period: Period;
  setPeriod: (period: Period) => void;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export function DashboardProvider({ children }: PropsWithChildren) {
  const [period, setPeriod] = useState<Period>('weekly');

  const value = useMemo(
    () => ({
      period,
      setPeriod
    }),
    [period]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export { DashboardContext };