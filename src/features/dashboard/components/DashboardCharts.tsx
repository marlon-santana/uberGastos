import React, { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { formatDecimal } from "@/shared/utils";
import { parseISODateLocal, toISODate } from "@/shared/utils/format";
import { BarChart, LineChart } from "react-native-chart-kit";
import { Card } from "@/shared/components";
import { colors, spacing } from "@/shared/theme";
import { Transaction } from "@/features/transactions/types";
import { Period } from "@/shared/types/common";
import { DailyRidesLineChart } from "@/features/dashboard/components/DailyRidesLineChart";

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
  color: (opacity = 1) => `rgba(77, 208, 138, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(233, 244, 238, ${opacity})`,
  propsForBackgroundLines: {
    stroke: colors.border,
    strokeDasharray: "",
  },
};

const lineChartConfig = {
  backgroundGradientFrom: colors.surface,
  backgroundGradientTo: colors.surface,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(77, 208, 138, ${opacity})`,
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
  const chartWidth = screenWidth - 64;

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const groupedData = useMemo(() => {
    let labels: string[] = [];
    let groupedIncome: number[] = [];
    let groupedExpense: number[] = [];
    let workedDays: number[] = [];

    if (period === "weekly") {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const dayOfWeek = now.getDay();
      const sunday = new Date(now);
      sunday.setDate(now.getDate() - dayOfWeek);
      sunday.setHours(0, 0, 0, 0);

      const weekDates = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(sunday);
        date.setDate(sunday.getDate() + index);
        date.setHours(0, 0, 0, 0);
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
  }, [transactions, period]);

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
        <Text style={styles.title}>Ganhos</Text>
        <BarChart
          data={{
            labels: groupedData.labels,
            datasets: [
              {
                data: groupedData.income,
                color: (opacity = 1) => `rgba(77, 208, 138, ${opacity})`,
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
      </Card>

      <Card>
        <Text style={styles.title}>Despesas</Text>
        <BarChart
          data={{
            labels: groupedData.labels,
            datasets: [
              {
                data: groupedData.expense,
                color: (opacity = 1) => `rgba(255, 92, 92, ${opacity})`,
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
            color: (opacity = 1) => `rgba(255, 92, 92, ${opacity})`,
          }}
          style={styles.chart}
          showValuesOnTopOfBars
          withHorizontalLabels
        />
      </Card>

      <Card>
        <Text style={styles.title}>Lucro liquido</Text>
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
          withInnerLines
          withOuterLines
          withVerticalLines
          withHorizontalLines
        />
      </Card>

      <Card>
        <Text style={styles.title}>Dias trabalhados</Text>
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
            color: (opacity = 1) => `rgba(61, 169, 252, ${opacity})`,
          }}
          style={styles.chart}
          withDots
          withInnerLines
          withOuterLines
          withVerticalLines
          withHorizontalLines
        />
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
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  chart: {
    borderRadius: 12,
  },
});
