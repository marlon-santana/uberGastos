import React, { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { formatDecimal } from "@/shared/utils";
import { BarChart, LineChart } from "react-native-chart-kit";
import { Card } from "@/shared/components";
import { colors, spacing } from "@/shared/theme";
import { Transaction } from "@/features/transactions/types";
import { Period } from "@/shared/types/common";

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

export function DashboardCharts({
  income,
  expense,
  netProfit,
  transactions,
  period,
}: DashboardChartsProps) {
  const chartWidth = screenWidth - 64;

  // Helpers para labels
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
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

  // Agrupa ganhos e despesas por dia da semana atual ou mês do ano
  const groupedData = useMemo(() => {
    let labels: string[] = [];
    let income: number[] = [];
    let expense: number[] = [];
    if (period === "weekly") {
      // Pega o domingo da semana atual
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const dayOfWeek = now.getDay();
      const sunday = new Date(now);
      sunday.setDate(now.getDate() - dayOfWeek);
      sunday.setHours(0, 0, 0, 0);
      // Monta datas da semana atual (YYYY-MM-DD)
      const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(sunday);
        d.setDate(sunday.getDate() + i);
        d.setHours(0, 0, 0, 0);
        return d;
      });
      labels = weekDates.map((d) => weekDays[d.getDay()]);
      income = weekDates.map((d) => {
        const dateStr = d.toISOString().slice(0, 10);
        return transactions
          .filter((t) => t.type === "income" && t.date === dateStr)
          .reduce((sum, t) => sum + t.amount, 0);
      });
      expense = weekDates.map((d) => {
        const dateStr = d.toISOString().slice(0, 10);
        return transactions
          .filter((t) => t.type === "expense" && t.date === dateStr)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      });
    } else {
      const currentYear = new Date().getFullYear();
      labels = months;
      income = months.map((m, idx) =>
        transactions
          .filter(
            (t) =>
              t.type === "income" &&
              new Date(t.date).getMonth() === idx &&
              new Date(t.date).getFullYear() === currentYear,
          )
          .reduce((sum, t) => sum + t.amount, 0),
      );
      expense = months.map((m, idx) =>
        transactions
          .filter(
            (t) =>
              t.type === "expense" &&
              new Date(t.date).getMonth() === idx &&
              new Date(t.date).getFullYear() === currentYear,
          )
          .reduce((sum, t) => sum + Math.abs(t.amount), 0),
      );
    }
    return { labels, income, expense };
  }, [transactions, period]);

  // Lucro líquido agrupado por período
  const netProfitData = useMemo(() => {
    if (period === "weekly") {
      // Acumulado ao longo da semana
      let acc = 0;
      return groupedData.labels.map((_, idx) => {
        acc += (groupedData.income[idx] || 0) - (groupedData.expense[idx] || 0);
        return acc;
      });
    } else {
      // Mensal: valor do mês
      return groupedData.labels.map(
        (_, idx) =>
          (groupedData.income[idx] || 0) - (groupedData.expense[idx] || 0),
      );
    }
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
            legend: ["Ganhos"],
          }}
          width={chartWidth}
          height={180}
          fromZero
          yAxisLabel="R$ "
          yAxisSuffix=""
          formatYLabel={formatDecimal}
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
            legend: ["Despesas"],
          }}
          width={chartWidth}
          height={180}
          fromZero
          yAxisLabel="R$ "
          yAxisSuffix=""
          formatYLabel={formatDecimal}
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
        <Text style={styles.title}>Lucro Líquido</Text>
        <LineChart
          data={{
            labels: groupedData.labels,
            datasets: [
              { data: netProfitData.length > 0 ? netProfitData : [0] },
            ],
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
    </View>
  );
}

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
