import React, { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
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

  // Group transactions by date and calculate net profit per day
  const dailyNetProfit = useMemo(() => {
    const dataByDate = new Map<string, number>();
    
    transactions.forEach((transaction) => {
      const date = transaction.date;
      const amount = transaction.type === 'income' ? transaction.amount : -transaction.amount;
      dataByDate.set(date, (dataByDate.get(date) || 0) + amount);
    });

    // Sort dates and get the last 7 days for weekly, last 30 days for monthly
    const sortedDates = Array.from(dataByDate.keys()).sort();
    const maxDays = period === 'weekly' ? 7 : 30;
    const recentDates = sortedDates.slice(-maxDays);
    
    // If we have no data, show at least current day
    if (recentDates.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      return {
        labels: [today.slice(5)], // Show MM-DD
        data: [0],
        hasNegativeValues: false
      };
    }

    const data = recentDates.map(date => dataByDate.get(date) || 0);
    const hasNegativeValues = data.some(value => value < 0);

    return {
      labels: recentDates.map(date => date.slice(5)), // Show MM-DD
      data,
      hasNegativeValues
    };
  }, [transactions, period]);

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Ganhos vs Despesas</Text>
        <BarChart
          data={{
            labels: ["Ganhos", "Despesas"],
            datasets: [
              { 
                data: [income, expense],
                colors: [
                  (opacity = 1) => `rgba(77, 208, 138, ${opacity})`, // Green for income
                  (opacity = 1) => `rgba(255, 92, 92, ${opacity})`,   // Red for expense
                ]
              }
            ],
          }}
          width={chartWidth}
          height={220}
          fromZero
          yAxisLabel="R$ "
          yAxisSuffix=""
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars
          withCustomBarColorFromData
        />
      </Card>

      <Card>
        <Text style={styles.title}>Lucro Liquido</Text>
        <LineChart
          data={{
            labels: dailyNetProfit.labels,
            datasets: [{ data: dailyNetProfit.data.length > 0 ? dailyNetProfit.data : [0] }],
          }}
          width={chartWidth}
          height={190}
          yAxisLabel="R$ "
          fromZero={!dailyNetProfit.hasNegativeValues}
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
