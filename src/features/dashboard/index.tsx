import React, { useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { DashboardCharts } from "@/features/dashboard/components/DashboardCharts";
import { MoneyRain } from "@/features/dashboard/components/MoneyRain";
import { ResetMonthNoticeModal } from "@/features/dashboard/components/ResetMonthNoticeModal";
import { PeriodToggle } from "@/features/dashboard/components/PeriodToggle";
import { SummaryCard } from "@/features/dashboard/components/SummaryCard";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { DashboardMetricFactory } from "@/features/dashboard/factory/DashboardMetricFactory";
import { PeriodStrategyFactory } from "@/features/dashboard/strategies/PeriodStrategy";
import { AddTransactionModal } from "@/features/transactions/components";
import { useTransactions } from "@/features/transactions/hooks";
import { useAds } from "@/features/ads/hooks";
import { FixedAdBanner } from "@/features/ads/components";
import { FloatingActionButton, PrimaryButton } from "@/shared/components";
import { parseISODateLocal, toMonthKey } from "@/shared/utils/format";
import { colors, spacing } from "@/shared/theme";

const MONTH_RESET_STORAGE_KEY = "@drivercash:month-reset-ignored-ids";
const CUSTOM_CATEGORIES_STORAGE_KEY = "@drivercash:custom-categories";
const DEFAULT_CATEGORIES = ["Uber", "99Taxi", "Ifood"];
const ALL_CATEGORIES_LABEL = "Todas";

type ResetMap = Record<string, string[]>;

export default function DashboardScreen() {
  const { period, setPeriod } = useDashboard();
  const { transactions, addTransaction, loading } = useTransactions();
  const { maybeShowInterstitial } = useAds();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showResetNotice, setShowResetNotice] = useState(false);
  const [resetMap, setResetMap] = useState<ResetMap>({});
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    ALL_CATEGORIES_LABEL,
  );
  const [showMoneyRain, setShowMoneyRain] = useState(false);
  const moneyRainTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const filteredTransactions = useMemo(() => {
    const periodStrategy = PeriodStrategyFactory.create(period);
    return periodStrategy.filter(transactions);
  }, [transactions, period]);

  React.useEffect(() => {
    let mounted = true;

    const loadResetMap = async () => {
      try {
        const raw = await AsyncStorage.getItem(MONTH_RESET_STORAGE_KEY);
        if (mounted && raw) {
          const parsed = JSON.parse(raw) as ResetMap;
          setResetMap(parsed);
        }
      } catch (error) {
        console.error("Failed to load month reset data", error);
      }
    };

    loadResetMap();

    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    let mounted = true;

    const loadCustomCategories = async () => {
      try {
        const raw = await AsyncStorage.getItem(CUSTOM_CATEGORIES_STORAGE_KEY);
        if (mounted && raw) {
          const parsed = JSON.parse(raw) as string[];
          setCustomCategories(parsed);
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    loadCustomCategories();

    return () => {
      mounted = false;
    };
  }, []);

  const currentMonthKey = toMonthKey();
  const ignoredCurrentMonthIds = useMemo(
    () => new Set(resetMap[currentMonthKey] || []),
    [currentMonthKey, resetMap],
  );
  const cardTransactions = useMemo(
    () =>
      filteredTransactions.filter(
        (transaction) => !ignoredCurrentMonthIds.has(transaction.id),
      ),
    [filteredTransactions, ignoredCurrentMonthIds],
  );

  const categories = useMemo(
    () => [...DEFAULT_CATEGORIES, ...customCategories],
    [customCategories],
  );

  React.useEffect(() => {
    if (
      selectedCategory !== ALL_CATEGORIES_LABEL &&
      !categories.includes(selectedCategory)
    ) {
      setSelectedCategory(ALL_CATEGORIES_LABEL);
    }
  }, [categories, selectedCategory]);

  const chartTransactions = useMemo(() => {
    if (selectedCategory === ALL_CATEGORIES_LABEL) {
      return filteredTransactions;
    }

    return filteredTransactions.filter(
      (transaction) => transaction.category === selectedCategory,
    );
  }, [filteredTransactions, selectedCategory]);

  const metrics = useMemo(() => {
    const incomeService = DashboardMetricFactory.createIncomeService();
    const expenseService = DashboardMetricFactory.createExpenseService();
    const netService = DashboardMetricFactory.createNetProfitService();

    const income = incomeService.execute(cardTransactions);
    const expense = expenseService.execute(cardTransactions);

    return {
      income,
      expense,
      netProfit: netService.execute(cardTransactions),
    };
  }, [cardTransactions]);

  const persistCategories = React.useCallback(async (next: string[]) => {
    try {
      await AsyncStorage.setItem(
        CUSTOM_CATEGORIES_STORAGE_KEY,
        JSON.stringify(next),
      );
    } catch (error) {
      console.error("Failed to persist categories", error);
    }
  }, []);

  const handleAddCategory = React.useCallback(
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
      await persistCategories(next);
      return true;
    },
    [customCategories, persistCategories],
  );

  const handleDeleteCategory = React.useCallback(
    (category: string) => {
      Alert.alert(
        "Excluir categoria",
        `Deseja excluir a categoria "${category}"?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Excluir",
            style: "destructive",
            onPress: () => {
              const next = customCategories.filter((item) => item !== category);
              setCustomCategories(next);
              persistCategories(next);
              if (selectedCategory === category) {
                setSelectedCategory(ALL_CATEGORIES_LABEL);
              }
            },
          },
        ],
      );
    },
    [customCategories, persistCategories, selectedCategory],
  );

  React.useEffect(() => {
    return () => {
      if (moneyRainTimerRef.current) {
        clearTimeout(moneyRainTimerRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const handleAddTransaction = async (
    ...args: Parameters<typeof addTransaction>
  ) => {
    const type = args[0];
    const wasEmpty = transactions.length === 0;
    await addTransaction(...args);
    if (wasEmpty) setShowCongrats(true);
    if (type === "income") {
      setShowMoneyRain(true);
      if (moneyRainTimerRef.current) {
        clearTimeout(moneyRainTimerRef.current);
      }
      moneyRainTimerRef.current = setTimeout(() => {
        setShowMoneyRain(false);
      }, 3800);
    }
  };

  const handleOpenModal = () => {
    maybeShowInterstitial("dashboard_open_add_transaction", () => {
      setModalOpen(true);
    });
  };

  const handleResetMonth = async () => {
    const monthTransactionIds = transactions
      .filter(
        (transaction) =>
          toMonthKey(parseISODateLocal(transaction.date)) === currentMonthKey,
      )
      .map((transaction) => transaction.id);

    const next = {
      ...resetMap,
      [currentMonthKey]: monthTransactionIds,
    };

    setResetMap(next);

    try {
      await AsyncStorage.setItem(MONTH_RESET_STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.error("Failed to persist month reset data", error);
    }

    setShowResetNotice(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.cardsRow}>
          <SummaryCard label="Ganhos" value={metrics.income} tone="income" />
          <SummaryCard
            label="Despesas"
            value={metrics.expense}
            tone="expense"
          />
        </View>
        <SummaryCard label="Lucro" value={metrics.netProfit} tone="profit" />
        <PrimaryButton label="Resetar mês Atual" onPress={handleResetMonth} />

        <PeriodToggle selected={period} onChange={setPeriod} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryChipsRow}
        >
          {[ALL_CATEGORIES_LABEL, ...categories].map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive,
              ]}
            >
              <View style={styles.categoryChipContent}>
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category &&
                      styles.categoryChipTextActive,
                  ]}
                >
                  {category}
                </Text>
                {category !== ALL_CATEGORIES_LABEL &&
                !DEFAULT_CATEGORIES.includes(category) ? (
                  <Pressable
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    onPress={() => handleDeleteCategory(category)}
                    style={styles.deleteCategoryButton}
                  >
                    <Text
                      style={[
                        styles.deleteCategoryText,
                        selectedCategory === category &&
                          styles.deleteCategoryTextActive,
                      ]}
                    >
                      x
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <DashboardCharts
          income={metrics.income}
          expense={metrics.expense}
          netProfit={metrics.netProfit}
          transactions={chartTransactions}
          period={period}
        />
      </ScrollView>

      <FixedAdBanner placement="dashboard_bottom" />
      <FloatingActionButton onPress={handleOpenModal} />
      <AddTransactionModal
        visible={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddTransaction}
        categories={categories}
        onAddCategory={handleAddCategory}
      />
      <ResetMonthNoticeModal
        visible={showResetNotice}
        onClose={() => setShowResetNotice(false)}
      />
      <MoneyRain visible={showMoneyRain} />
      {/* <CongratsModal visible={showCongrats} onClose={() => setShowCongrats(false)} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 110,
    gap: spacing.md,
  },
  cardsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryChipsRow: {
    gap: spacing.xs,
    paddingBottom: spacing.xs,
  },
  categoryChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  categoryChipContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 13,
  },
  categoryChipTextActive: {
    color: "#0B1110",
  },
  deleteCategoryButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceAlt,
  },
  deleteCategoryText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 14,
  },
  deleteCategoryTextActive: {
    color: "#0B1110",
  },
});
