import React, { useMemo, useState, useTransition } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { DashboardCharts } from "@/features/dashboard/components/DashboardCharts";
import { DailyCostCard } from "@/features/dashboard/components/DailyCostCard";
import { ChartsToggleHeader } from "@/features/dashboard/components/ChartsToggleHeader";
import { MoneyRain } from "@/features/dashboard/components/MoneyRain";
import { ResetMonthNoticeModal } from "@/features/dashboard/components/ResetMonthNoticeModal";
import { PeriodToggle } from "@/features/dashboard/components/PeriodToggle";
import { SummaryCard } from "@/features/dashboard/components/SummaryCard";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { DashboardMetricFactory } from "@/features/dashboard/factory/DashboardMetricFactory";
import { PeriodStrategyFactory } from "@/features/dashboard/strategies/PeriodStrategy";
import { AddTransactionModal } from "@/features/transactions/components";
import { useTransactions, useCategories } from "@/features/transactions/hooks";
import { useFixedCosts } from "@/features/fixedCosts/hooks";
import { useAds } from "@/features/ads/hooks";
import { FixedAdBanner } from "@/features/ads/components";
import {
  CategoryChipsRow,
  CongratsModal,
  EmptyState,
  FloatingActionButton,
  PrimaryButton,
} from "@/shared/components";
import { parseISODateLocal, toISODate, toMonthKey } from "@/shared/utils/format";
import { colors, spacing } from "@/shared/theme";

const MONTH_RESET_STORAGE_KEY = "@drivercash:month-reset-ignored-ids";
const CHARTS_COLLAPSED_STORAGE_KEY = "@drivercash:dashboard-charts-collapsed";
const ALL_CATEGORIES_LABEL = "Todas";

type ResetMap = Record<string, string[]>;

export default function DashboardScreen() {
  const { period, setPeriod } = useDashboard();
  const [isPeriodPending, startPeriodTransition] = useTransition();
  const { transactions, addTransaction, loading } = useTransactions();
  const { categories, addCategory, deleteCategory, isCustom } =
    useCategories();
  const { fixedCosts, totalDailyAmount } = useFixedCosts();
  const { maybeShowInterstitial } = useAds();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showResetNotice, setShowResetNotice] = useState(false);
  const [resetMap, setResetMap] = useState<ResetMap>({});
  const [chartsCollapsed, setChartsCollapsed] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    ALL_CATEGORIES_LABEL,
  );
  const [showMoneyRain, setShowMoneyRain] = useState(false);
  const moneyRainTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

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

    const loadChartsCollapsed = async () => {
      try {
        const stored = await AsyncStorage.getItem(CHARTS_COLLAPSED_STORAGE_KEY);
        if (mounted && stored !== null) {
          setChartsCollapsed(stored === "true");
        }
      } catch (error) {
        console.error("Failed to load charts visibility preference", error);
      }
    };

    loadChartsCollapsed();

    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleCharts = React.useCallback(() => {
    setChartsCollapsed((prev) => {
      const next = !prev;
      AsyncStorage.setItem(CHARTS_COLLAPSED_STORAGE_KEY, String(next)).catch((error) => {
        console.error("Failed to persist charts visibility preference", error);
      });
      return next;
    });
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

  const todayNetProfit = useMemo(() => {
    const todayISO = toISODate();
    const todayTransactions = transactions.filter(
      (transaction) => transaction.date === todayISO,
    );
    const netService = DashboardMetricFactory.createNetProfitService();
    return netService.execute(todayTransactions);
  }, [transactions]);

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
              deleteCategory(category);
              if (selectedCategory === category) {
                setSelectedCategory(ALL_CATEGORIES_LABEL);
              }
            },
          },
        ],
      );
    },
    [deleteCategory, selectedCategory],
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
    if (!mountedRef.current) return;
    if (wasEmpty) setShowCongrats(true);
    if (type === "income") {
      setShowMoneyRain(true);
      if (moneyRainTimerRef.current) {
        clearTimeout(moneyRainTimerRef.current);
      }
      moneyRainTimerRef.current = setTimeout(() => {
        if (mountedRef.current) setShowMoneyRain(false);
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
        <SummaryCard
          label="Lucro"
          value={metrics.netProfit}
          tone="profit"
          emphasis
        />

        {fixedCosts.length > 0 && (
          <DailyCostCard
            todayNetProfit={todayNetProfit}
            totalDailyAmount={totalDailyAmount}
          />
        )}

        <PrimaryButton label="Resetar mês Atual" onPress={handleResetMonth} />

        <View style={styles.periodRow}>
          <PeriodToggle
            selected={period}
            onChange={(nextPeriod) =>
              startPeriodTransition(() => setPeriod(nextPeriod))
            }
          />
          {isPeriodPending ? (
            <ActivityIndicator
              size="small"
              color={colors.primary}
              style={styles.periodPendingIndicator}
            />
          ) : null}
        </View>

        <CategoryChipsRow
          items={[ALL_CATEGORIES_LABEL, ...categories]}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          isDeletable={(category) =>
            category !== ALL_CATEGORIES_LABEL && isCustom(category)
          }
          onDelete={handleDeleteCategory}
        />

        {transactions.length === 0 ? (
          <EmptyState
            icon="bar-chart-2"
            title="Nenhum lançamento ainda"
            subtitle="Registre seu primeiro ganho ou despesa para ver seus gráficos aqui."
          />
        ) : (
          <>
            <ChartsToggleHeader
              collapsed={chartsCollapsed}
              onToggle={handleToggleCharts}
            />
            {!chartsCollapsed && (
              <DashboardCharts
                income={metrics.income}
                expense={metrics.expense}
                netProfit={metrics.netProfit}
                transactions={chartTransactions}
                period={period}
              />
            )}
          </>
        )}
      </ScrollView>

      <FixedAdBanner placement="dashboard_bottom" />
      <FloatingActionButton onPress={handleOpenModal} />
      <AddTransactionModal
        visible={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddTransaction}
        categories={categories}
        onAddCategory={addCategory}
      />
      <ResetMonthNoticeModal
        visible={showResetNotice}
        onClose={() => setShowResetNotice(false)}
      />
      <MoneyRain visible={showMoneyRain} />
      <CongratsModal
        visible={showCongrats}
        onClose={() => setShowCongrats(false)}
      />
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
  periodRow: {
    position: "relative",
  },
  periodPendingIndicator: {
    position: "absolute",
    right: spacing.sm,
    top: "50%",
    marginTop: -8,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
