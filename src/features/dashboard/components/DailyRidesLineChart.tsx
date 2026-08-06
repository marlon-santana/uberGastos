import React, { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { Transaction } from "@/features/transactions/types";
import { Card } from "@/shared/components";
import { parseISODateLocal, toISODate } from "@/shared/utils/format";
import { colors, font, radii, spacing } from "@/shared/theme";
import { Period } from "@/shared/types/common";

interface DailyRidesLineChartProps {
  transactions: Transaction[];
  period: Period;
}

const screenWidth = Dimensions.get("window").width;

const chartConfig = {
  backgroundGradientFrom: colors.surface,
  backgroundGradientTo: colors.surface,
  decimalPlaces: 0,
  color: () => colors.info,
  labelColor: (opacity = 1) => `rgba(233, 244, 238, ${opacity})`,
  fillShadowGradientOpacity: 1,
  propsForBackgroundLines: {
    stroke: colors.border,
    strokeDasharray: "",
  },
};

function getLastNDays(days: number): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Array.from({ length: days }, (_, index) => {
    const current = new Date(today);
    current.setDate(today.getDate() - (days - 1 - index));
    return current;
  });
}

export const DailyRidesLineChart = React.memo(function DailyRidesLineChart({
  transactions,
  period,
}: DailyRidesLineChartProps) {
  const chartWidth = screenWidth - 64;

  const { labels, ridesData, subtitle, title } = useMemo(() => {
    if (period === "monthly") {
      const currentYear = new Date().getFullYear();
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

      const ridesData = Array(12).fill(0);
      transactions.forEach((transaction) => {
        const parsedDate = parseISODateLocal(transaction.date);
        if (parsedDate.getFullYear() !== currentYear) {
          return;
        }

        const monthIndex = parsedDate.getMonth();
        ridesData[monthIndex] += Math.max(0, transaction.ridesCount || 0);
      });

      const total = ridesData.reduce((sum, value) => sum + value, 0);
      return {
        labels: months,
        ridesData,
        title: "Corridas totais",
        subtitle: `Total no ano: ${total}`,
      };
    }

    const lastDays = getLastNDays(7);
    const todayISO = toISODate(new Date());

    const labels = lastDays.map((date) => {
      const day = `${date.getDate()}`.padStart(2, "0");
      const month = `${date.getMonth() + 1}`.padStart(2, "0");
      return `${day}/${month}`;
    });

    const ridesData = Array(7).fill(0);
    const dayIndexByDate = new Map<string, number>();
    lastDays.forEach((date, index) => {
      dayIndexByDate.set(toISODate(date), index);
    });

    transactions.forEach((transaction) => {
      const dayIndex = dayIndexByDate.get(transaction.date);
      if (dayIndex === undefined) {
        return;
      }

      ridesData[dayIndex] += Math.max(0, transaction.ridesCount || 0);
    });

    const todayTotal = transactions
      .filter((transaction) => transaction.date === todayISO)
      .reduce((sum, transaction) => sum + Math.max(0, transaction.ridesCount || 0), 0);

    return {
      labels,
      ridesData,
      title: "Corridas por dia",
      subtitle: `Total de hoje: ${todayTotal}`,
    };
  }, [transactions, period]);

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <BarChart
        data={{
          labels,
          datasets: [
            {
              data: ridesData.length > 0 ? ridesData : [0],
              color: () => colors.info,
            },
          ],
        }}
        width={chartWidth}
        height={190}
        fromZero
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={chartConfig}
        style={styles.chart}
        withInnerLines
        showValuesOnTopOfBars
      />
    </Card>
  );
});

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontFamily: font.bold,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: font.regular,
    marginTop: 2,
  },
  chart: {
    borderRadius: radii.md,
  },
});
