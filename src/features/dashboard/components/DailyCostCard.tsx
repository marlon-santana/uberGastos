import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/shared/components';
import { colors, font, radii, spacing } from '@/shared/theme';
import { formatCurrency } from '@/shared/utils/format';

interface DailyCostCardProps {
  todayNetProfit: number;
  totalDailyAmount: number;
}

export function DailyCostCard({ todayNetProfit, totalDailyAmount }: DailyCostCardProps) {
  const diff = todayNetProfit - totalDailyAmount;
  const covered = diff >= 0;
  const color = covered ? colors.success : colors.danger;
  const icon = covered ? 'check-circle' : 'alert-circle';
  const label = covered ? 'Meta do dia batida' : 'Falta para cobrir hoje';

  return (
    <Card style={styles.card}>
      <View style={[styles.accentBar, { backgroundColor: color }]} />
      <View style={styles.header}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        <View style={[styles.iconBadge, { backgroundColor: `${color}26` }]}>
          <Feather name={icon} size={14} color={color} />
        </View>
      </View>
      <Text style={[styles.value, { color }]}>{formatCurrency(Math.abs(diff))}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 100,
    overflow: 'hidden',
    paddingTop: spacing.md + 4
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: font.bold,
    letterSpacing: 0.6
  },
  iconBadge: {
    width: 24,
    height: 24,
    borderRadius: radii.round,
    alignItems: 'center',
    justifyContent: 'center'
  },
  value: {
    fontSize: 22,
    fontFamily: font.extrabold
  }
});
