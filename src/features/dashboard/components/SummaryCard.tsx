import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/shared/components';
import { colors, font, radii, spacing } from '@/shared/theme';
import { formatCurrency } from '@/shared/utils/format';

interface SummaryCardProps {
  label: string;
  value: number;
  tone: 'income' | 'expense' | 'profit';
  emphasis?: boolean;
}

const TONE_CONFIG = {
  income: { color: colors.success, icon: 'trending-up' as const },
  expense: { color: colors.danger, icon: 'trending-down' as const },
  profit: { color: colors.info, icon: 'activity' as const }
};

export function SummaryCard({ label, value, tone, emphasis }: SummaryCardProps) {
  const { color, icon } = TONE_CONFIG[tone];

  return (
    <Card style={[styles.card, emphasis && styles.cardEmphasis] as any}>
      <View style={[styles.accentBar, { backgroundColor: color }]} />
      <View style={styles.header}>
        <Text style={styles.label}>{label.toUpperCase()}</Text>
        <View style={[styles.iconBadge, { backgroundColor: `${color}26` }]}>
          <Feather name={icon} size={14} color={color} />
        </View>
      </View>
      <Text style={[styles.value, emphasis && styles.valueEmphasis, { color }]}>
        {formatCurrency(value)}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 100,
    overflow: 'hidden',
    paddingTop: spacing.md + 4
  },
  cardEmphasis: {
    minHeight: 116
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
  },
  valueEmphasis: {
    fontSize: 28
  }
});
