import React, { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { DashboardCharts } from "@/features/dashboard/components/DashboardCharts";
import { PeriodToggle } from "@/features/dashboard/components/PeriodToggle";
import { SummaryCard } from "@/features/dashboard/components/SummaryCard";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { DashboardMetricFactory } from "@/features/dashboard/factory/DashboardMetricFactory";
import { PeriodStrategyFactory } from "@/features/dashboard/strategies/PeriodStrategy";
import { AddTransactionModal } from "@/features/transactions/components";
import { useTransactions } from "@/features/transactions/hooks";
import { FloatingActionButton } from "@/shared/components";
import { colors, spacing } from "@/shared/theme";

export default function DashboardScreen() {
  const { period, setPeriod } = useDashboard();
  const { transactions, addTransaction, loading } = useTransactions();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const filteredTransactions = useMemo(() => {
    // O filtro de periodo e extensivel via Strategy sem alterar o componente.
    const periodStrategy = PeriodStrategyFactory.create(period);
    return periodStrategy.filter(transactions);
  }, [transactions, period]);

  const metrics = useMemo(() => {
    const incomeService = DashboardMetricFactory.createIncomeService();
    const expenseService = DashboardMetricFactory.createExpenseService();
    const netService = DashboardMetricFactory.createNetProfitService();

    const income = incomeService.execute(filteredTransactions);
    const expense = expenseService.execute(filteredTransactions);

    return {
      income,
      expense,
      netProfit: netService.execute(filteredTransactions),
    };
  }, [filteredTransactions]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  // Handler para mostrar parabéns ao adicionar o primeiro lançamento
  const handleAddTransaction = async (
    ...args: Parameters<typeof addTransaction>
  ) => {
    const wasEmpty = transactions.length === 0;
    await addTransaction(...args);
    if (wasEmpty) setShowCongrats(true);
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

        <PeriodToggle selected={period} onChange={setPeriod} />

        <DashboardCharts
          income={metrics.income}
          expense={metrics.expense}
          netProfit={metrics.netProfit}
          transactions={filteredTransactions}
          period={period}
        />
      </ScrollView>

      <FloatingActionButton onPress={() => setModalOpen(true)} />
      <AddTransactionModal
        visible={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddTransaction}
      />
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
});
