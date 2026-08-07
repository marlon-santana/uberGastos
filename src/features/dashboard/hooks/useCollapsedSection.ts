import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useCollapsedSection(
  storageKey: string,
): [boolean, () => void] {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  React.useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (mounted && stored !== null) {
          setCollapsed(stored === "true");
        }
      } catch (error) {
        console.error("Failed to load section visibility preference", error);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [storageKey]);

  const toggle = React.useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      AsyncStorage.setItem(storageKey, String(next)).catch((error) => {
        console.error("Failed to persist section visibility preference", error);
      });
      return next;
    });
  }, [storageKey]);

  return [collapsed, toggle];
}
