import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/shared/components';
import { colors, spacing } from '@/shared/theme';
import { formatCurrency } from '@/shared/utils/format';
import { FixedCost } from '@/features/fixedCosts/types/fixedCost';

interface FixedCostsListProps {
  fixedCosts: FixedCost[];
  onRemove: (id: string) => void;
}

const frequencyLabels = {
  monthly: 'Mensal',
  weekly: 'Semanal',
  yearly: 'Anual'
};

export function FixedCostsList({ fixedCosts, onRemove }: FixedCostsListProps) {
  return (
    <FlatList
      data={fixedCosts}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      ListEmptyComponent={<Text style={styles.empty}>Nenhum custo fixo cadastrado.</Text>}
      renderItem={({ item }) => (
        <Card style={styles.item}>
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{frequencyLabels[item.frequency]}</Text>
            {item.description ? <Text style={styles.meta}>{item.description}</Text> : null}
          </View>
          <View style={styles.actions}>
            <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
            <Pressable onPress={() => onRemove(item.id)} style={styles.removeButton}>
              <Text style={styles.removeText}>Remover</Text>
            </Pressable>
          </View>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
    paddingBottom: 100
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  info: {
    flex: 1
  },
  name: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2
  },
  actions: {
    alignItems: 'flex-end',
    gap: spacing.xs
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.danger
  },
  removeButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  removeText: {
    color: colors.textMuted,
    fontSize: 12
  },
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg
  }
});
