import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Card } from '@/shared/components';
import { colors, spacing } from '@/shared/theme';

interface DashboardChartsProps {
  income: number;
  expense: number;
  netProfit: number;
}

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: colors.surface,
  backgroundGradientTo: colors.surface,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(77, 208, 138, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(233, 244, 238, ${opacity})`,
  propsForBackgroundLines: {
    stroke: colors.border,
    strokeDasharray: ''
  }
};

export function DashboardCharts({ income, expense, netProfit }: DashboardChartsProps) {
  const chartWidth = screenWidth - 64;

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Ganhos vs Despesas</Text>
        <BarChart
          data={{
            labels: ['Ganhos', 'Despesas'],
            datasets: [{ data: [income, expense] }]
          }}
          width={chartWidth}
          height={220}
          fromZero
          yAxisLabel="R$ "
          yAxisSuffix=""
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars
        />
      </Card>

      <Card>
        <Text style={styles.title}>Lucro L�quido</Text>
        <LineChart
          data={{
            labels: ['Atual'],
            datasets: [{ data: [netProfit] }]
          }}
          width={chartWidth}
          height={190}
          yAxisLabel="R$ "
          fromZero
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    marginBottom: 100
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm
  },
  chart: {
    borderRadius: 12
  }
});