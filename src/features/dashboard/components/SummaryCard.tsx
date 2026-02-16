import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/shared/components';
import { colors, spacing } from '@/shared/theme';
import { formatCurrency } from '@/shared/utils/format';

interface SummaryCardProps {
  label: string;
  value: number;
  tone: 'income' | 'expense' | 'profit';
}

export function SummaryCard({ label, value, tone }: SummaryCardProps) {
  const color = tone === 'income' ? colors.success : tone === 'expense' ? colors.danger : colors.info;

  return (
    <Card style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={[styles.value, { color }]}>{formatCurrency(value)}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 92
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.sm
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 999
  },
  value: {
    fontSize: 18,
    fontWeight: '700'
  }
});