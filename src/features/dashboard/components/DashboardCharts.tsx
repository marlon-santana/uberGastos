import React, { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { formatDecimal } from "@/shared/utils";
import { parseISODateLocal, toISODate } from "@/shared/utils/format";
import { BarChart, LineChart } from "react-native-chart-kit";
import { Card } from "@/shared/components";
import { colors, radii, spacing } from "@/shared/theme";
import { Transaction } from "@/features/transactions/types";
import { Period } from "@/shared/types/common";
import { DailyRidesLineChart } from "@/features/dashboard/components/DailyRidesLineChart";
import { ChartsToggleHeader } from "@/features/dashboard/components/ChartsToggleHeader";
import { useCollapsedSection } from "@/features/dashboard/hooks/useCollapsedSection";

interface DashboardChartsProps {
  income: number;
  expense: number;
  netProfit: number;
  transactions: Transaction[];
  period: Period;
}

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: colors.surface,
  backgroundGradientTo: colors.surface,
  decimalPlaces: 0,
  color: () => colors.accent,
  labelColor: (opacity = 1) => `rgba(233, 244, 238, ${opacity})`,
  fillShadowGradientOpacity: 1,
  propsForBackgroundLines: {
    stroke: colors.border,
    strokeDasharray: "",
  },
};

const lineChartConfig = {
  backgroundGradientFrom: colors.surface,
  backgroundGradientTo: colors.surface,
  decimalPlaces: 0,
  color: () => colors.accent,
  labelColor: (opacity = 1) => `rgba(233, 244, 238, ${opacity})`,
  propsForBackgroundLines: {
    stroke: colors.border,
    strokeDasharray: "",
  },
};

export const DashboardCharts = React.memo(function DashboardCharts({
  transactions,
  period,
}: DashboardChartsProps) {
  const { t, i18n } = useTranslation();
  const chartWidth = screenWidth - 64;

  const [incomeCollapsed, toggleIncomeCollapsed] = useCollapsedSection(
    "@drivercash:chart-collapsed-income",
  );
  const [expenseCollapsed, toggleExpenseCollapsed] = useCollapsedSection(
    "@drivercash:chart-collapsed-expense",
  );
  const [netProfitCollapsed, toggleNetProfitCollapsed] = useCollapsedSection(
    "@drivercash:chart-collapsed-netprofit",
  );
  const [workedDaysCollapsed, toggleWorkedDaysCollapsed] = useCollapsedSection(
    "@drivercash:chart-collapsed-workeddays",
  );

  const weekDays = t("dashboard.charts.weekDays", {
    returnObjects: true,
  }) as string[];
  const months = t("dashboard.charts.months", {
    returnObjects: true,
  }) as string[];

  const groupedData = useMemo(() => {
    let labels: string[] = [];
    let groupedIncome: number[] = [];
    let groupedExpense: number[] = [];
    let workedDays: number[] = [];

    if (period === "weekly") {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const dayOfWeek = now.getDay(); // 0 = Domingo .. 6 = Sábado
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - dayOfWeek);

      const weekDates = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + index);
        return date;
      });

      labels = weekDates.map((date) => weekDays[date.getDay()]);
      groupedIncome = Array(7).fill(0);
      groupedExpense = Array(7).fill(0);
      const workedFlags = Array(7).fill(0);

      const weekIndexByDate = new Map<string, number>();
      weekDates.forEach((date, index) => {
        weekIndexByDate.set(toISODate(date), index);
      });

      transactions.forEach((transaction) => {
        const weekIndex = weekIndexByDate.get(transaction.date);
        if (weekIndex === undefined) {
          return;
        }

        if (transaction.type === "income") {
          groupedIncome[weekIndex] += transaction.amount;
          workedFlags[weekIndex] = 1;
        } else {
          groupedExpense[weekIndex] += Math.abs(transaction.amount);
        }
      });

      let accumulatedWorkedDays = 0;
      workedDays = workedFlags.map((hasIncomeInDay) => {
        if (hasIncomeInDay > 0) {
          accumulatedWorkedDays += 1;
        }
        return accumulatedWorkedDays;
      });
    } else {
      const currentYear = new Date().getFullYear();
      labels = months;
      groupedIncome = Array(12).fill(0);
      groupedExpense = Array(12).fill(0);
      const monthWorkedDaySets = Array.from({ length: 12 }, () => new Set<string>());

      transactions.forEach((transaction) => {
        const parsedDate = parseISODateLocal(transaction.date);
        if (parsedDate.getFullYear() !== currentYear) {
          return;
        }

        const monthIndex = parsedDate.getMonth();
        if (transaction.type === "income") {
          groupedIncome[monthIndex] += transaction.amount;
          monthWorkedDaySets[monthIndex].add(transaction.date);
        } else {
          groupedExpense[monthIndex] += Math.abs(transaction.amount);
        }
      });

      workedDays = monthWorkedDaySets.map((daysSet) => daysSet.size);
    }

    return { labels, income: groupedIncome, expense: groupedExpense, workedDays };
  }, [transactions, period, i18n.language]);

  const netProfitData = useMemo(() => {
    if (period === "weekly") {
      let accumulated = 0;
      return groupedData.labels.map((_, index) => {
        accumulated += (groupedData.income[index] || 0) - (groupedData.expense[index] || 0);
        return accumulated;
      });
    }

    return groupedData.labels.map(
      (_, index) => (groupedData.income[index] || 0) - (groupedData.expense[index] || 0),
    );
  }, [groupedData, period]);

  return (
    <View style={styles.container}>
      <Card>
        <ChartsToggleHeader
          label={t("dashboard.charts.income")}
          collapsed={incomeCollapsed}
          onToggle={toggleIncomeCollapsed}
        />
        {!incomeCollapsed && (
          <BarChart
            data={{
              labels: groupedData.labels,
              datasets: [
                {
                  data: groupedData.income,
                  color: () => colors.accent,
                },
              ],
            }}
            width={chartWidth}
            height={180}
            fromZero
            yAxisLabel="R$ "
            yAxisSuffix=""
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
            withHorizontalLabels
          />
        )}
      </Card>

      <Card>
        <ChartsToggleHeader
          label={t("dashboard.charts.expense")}
          collapsed={expenseCollapsed}
          onToggle={toggleExpenseCollapsed}
        />
        {!expenseCollapsed && (
          <BarChart
            data={{
              labels: groupedData.labels,
              datasets: [
                {
                  data: groupedData.expense,
                  color: () => colors.danger,
                },
              ],
            }}
            width={chartWidth}
            height={180}
            fromZero
            yAxisLabel="R$ "
            yAxisSuffix=""
            chartConfig={{
              ...chartConfig,
              color: () => colors.danger,
            }}
            style={styles.chart}
            showValuesOnTopOfBars
            withHorizontalLabels
          />
        )}
      </Card>

      <Card>
        <ChartsToggleHeader
          label={t("dashboard.charts.netProfit")}
          collapsed={netProfitCollapsed}
          onToggle={toggleNetProfitCollapsed}
        />
        {!netProfitCollapsed && (
          <LineChart
            data={{
              labels: groupedData.labels,
              datasets: [{ data: netProfitData.length > 0 ? netProfitData : [0] }],
            }}
            width={chartWidth}
            height={190}
            yAxisLabel="R$ "
            yAxisSuffix=""
            formatYLabel={formatDecimal}
            fromZero
            chartConfig={lineChartConfig}
            bezier
            style={styles.chart}
            withDots
            withOuterLines
            withHorizontalLines
          />
        )}
      </Card>

      <Card>
        <ChartsToggleHeader
          label={t("dashboard.charts.workedDays")}
          collapsed={workedDaysCollapsed}
          onToggle={toggleWorkedDaysCollapsed}
        />
        {!workedDaysCollapsed && (
          <LineChart
            data={{
              labels: groupedData.labels,
              datasets: [{ data: groupedData.workedDays.length > 0 ? groupedData.workedDays : [0] }],
            }}
            width={chartWidth}
            height={190}
            fromZero
            chartConfig={{
              ...lineChartConfig,
              color: () => colors.info,
            }}
            style={styles.chart}
            withDots
            withOuterLines
            withHorizontalLines
          />
        )}
      </Card>

      <DailyRidesLineChart transactions={transactions} period={period} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    marginBottom: 100,
  },
  chart: {
    borderRadius: radii.md,
  },
});
