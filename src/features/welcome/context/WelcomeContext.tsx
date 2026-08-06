import React, { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WELCOME_STORAGE_KEY = '@drivercash:welcome-started';

interface WelcomeContextValue {
  started: boolean;
  hydrated: boolean;
  start: () => void;
}

const WelcomeContext = createContext<WelcomeContextValue | undefined>(undefined);

export function WelcomeProvider({ children }: PropsWithChildren) {
  const [started, setStarted] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(WELCOME_STORAGE_KEY)
      .then((value) => {
        if (mounted && value === 'true') {
          setStarted(true);
        }
      })
      .catch((error) => console.error('Failed to load welcome state', error))
      .finally(() => {
        if (mounted) {
          setHydrated(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const start = useCallback(() => {
    setStarted(true);
    AsyncStorage.setItem(WELCOME_STORAGE_KEY, 'true').catch((error) =>
      console.error('Failed to persist welcome state', error)
    );
  }, []);

  const value = useMemo(
    () => ({
      started,
      hydrated,
      start
    }),
    [started, hydrated, start]
  );

  return <WelcomeContext.Provider value={value}>{children}</WelcomeContext.Provider>;
}

export { WelcomeContext };