import React, { useMemo } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { BarChart } from "react-native-chart-kit";
import { Transaction } from "@/features/transactions/types";
import { Card } from "@/shared/components";
import { parseISODateLocal, toISODate } from "@/shared/utils/format";
import { colors, font, radii, spacing } from "@/shared/theme";
import { Period } from "@/shared/types/common";
import { ChartsToggleHeader } from "@/features/dashboard/components/ChartsToggleHeader";
import { useCollapsedSection } from "@/features/dashboard/hooks/useCollapsedSection";

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
  const { t, i18n } = useTranslation();
  const chartWidth = screenWidth - 64;
  const [collapsed, toggleCollapsed] = useCollapsedSection(
    "@drivercash:chart-collapsed-dailyrides",
  );

  const { labels, ridesData, subtitle, title } = useMemo(() => {
    if (period === "monthly") {
      const currentYear = new Date().getFullYear();
      const months = t("dashboard.charts.months", {
        returnObjects: true,
      }) as string[];

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
        title: t("dashboard.charts.ridesTotal"),
        subtitle: t("dashboard.charts.totalYear", { count: total }),
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
      title: t("dashboard.charts.ridesPerDay"),
      subtitle: t("dashboard.charts.totalToday", { count: todayTotal }),
    };
  }, [transactions, period, i18n.language]);

  return (
    <Card>
      <ChartsToggleHeader
        label={title}
        collapsed={collapsed}
        onToggle={toggleCollapsed}
      />
      {!collapsed && (
        <>
          <Text style={styles.subtitle}>{subtitle}</Text>
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
        </>
      )}
    </Card>
  );
});

const styles = StyleSheet.create({
  subtitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: font.regular,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  chart: {
    borderRadius: radii.md,
  },
});
