import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card } from '@/shared/components';
import { colors, spacing } from '@/shared/theme';
import { FixedCost } from '@/features/fixedCosts/types';

interface FixedCostsListProps {
  costs: FixedCost[];
  onDelete: (id: string) => void;
}

export function FixedCostsList({ costs, onDelete }: FixedCostsListProps) {
  if (costs.length === 0) {
    return (
      <Card>
        <Text style={styles.emptyText}>Nenhum custo fixo cadastrado.</Text>
        <Text style={styles.emptySubtext}>
          Adicione um custo fixo para calcular quanto você precisa fazer por dia.
        </Text>
      </Card>
    );
  }

  return (
    <FlatList
      data={costs}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Card>
          <View style={styles.itemHeader}>
            <View style={styles.itemInfo}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.value}>R$ {item.value.toFixed(2)}</Text>
            </View>
            <Pressable onPress={() => onDelete(item.id)} style={styles.deleteButton}>
              <Feather name="trash-2" size={20} color={colors.danger} />
            </Pressable>
          </View>
          <View style={styles.divider} />
          <View style={styles.itemDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Data inicial:</Text>
              <Text style={styles.detailValue}>{item.startDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Data final:</Text>
              <Text style={styles.detailValue}>{item.endDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Dias para pagar:</Text>
              <Text style={styles.detailValue}>{item.daysToPayoff} dias</Text>
            </View>
            <View style={[styles.detailRow, styles.highlightRow]}>
              <Text style={styles.highlightLabel}>Valor diário:</Text>
              <Text style={styles.highlightValue}>R$ {item.dailyAmount.toFixed(2)}/dia</Text>
            </View>
          </View>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md
  },
  emptyText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs
  },
  emptySubtext: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm
  },
  itemInfo: {
    flex: 1
  },
  description: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs
  },
  value: {
    color: colors.danger,
    fontSize: 18,
    fontWeight: '700'
  },
  deleteButton: {
    padding: spacing.xs
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm
  },
  itemDetails: {
    gap: spacing.xs
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 14
  },
  detailValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500'
  },
  highlightRow: {
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  highlightLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600'
  },
  highlightValue: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700'
  }
});
