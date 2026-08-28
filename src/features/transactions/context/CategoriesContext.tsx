import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CUSTOM_CATEGORIES_STORAGE_KEY = "@drivercash:custom-categories";
export const DEFAULT_CATEGORIES: string[] = [];

interface CategoriesContextValue {
  categories: string[];
  loading: boolean;
  addCategory: (category: string) => Promise<boolean>;
  deleteCategory: (category: string) => Promise<void>;
  isCustom: (category: string) => boolean;
}

const CategoriesContext = createContext<CategoriesContextValue | undefined>(
  undefined,
);

export function CategoriesProvider({ children }: PropsWithChildren) {
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY)
      .then((raw) => {
        if (mounted && raw) {
          setCustomCategories(JSON.parse(raw) as string[]);
        }
      })
      .catch((error) => console.error("Failed to load categories", error))
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback(async (next: string[]) => {
    try {
      await AsyncStorage.setItem(
        CUSTOM_CATEGORIES_STORAGE_KEY,
        JSON.stringify(next),
      );
    } catch (error) {
      console.error("Failed to persist categories", error);
    }
  }, []);

  const addCategory = useCallback(
    async (category: string) => {
      const normalized = category.trim();
      if (!normalized) {
        return false;
      }

      const alreadyExists = [...DEFAULT_CATEGORIES, ...customCategories].some(
        (item) => item.toLowerCase() === normalized.toLowerCase(),
      );
      if (alreadyExists) {
        return false;
      }

      const next = [...customCategories, normalized];
      setCustomCategories(next);
      await persist(next);
      return true;
    },
    [customCategories, persist],
  );

  const deleteCategory = useCallback(
    async (category: string) => {
      const next = customCategories.filter((item) => item !== category);
      setCustomCategories(next);
      await persist(next);
    },
    [customCategories, persist],
  );

  const isCustom = useCallback(
    (category: string) => !DEFAULT_CATEGORIES.includes(category),
    [],
  );

  const categories = useMemo(
    () => [...DEFAULT_CATEGORIES, ...customCategories],
    [customCategories],
  );

  const value = useMemo(
    () => ({ categories, loading, addCategory, deleteCategory, isCustom }),
    [categories, loading, addCategory, deleteCategory, isCustom],
  );

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export { CategoriesContext };
