import React, { createContext, PropsWithChildren, useMemo, useState } from 'react';

interface WelcomeContextValue {
  started: boolean;
  start: () => void;
}

const WelcomeContext = createContext<WelcomeContextValue | undefined>(undefined);

export function WelcomeProvider({ children }: PropsWithChildren) {
  const [started, setStarted] = useState<boolean>(false);

  const value = useMemo(
    () => ({
      started,
      start: () => setStarted(true)
    }),
    [started]
  );

  return <WelcomeContext.Provider value={value}>{children}</WelcomeContext.Provider>;
}

export { WelcomeContext };