import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Card, EmptyState } from '@/shared/components';
import { colors, font, radii, spacing } from '@/shared/theme';
import { formatCurrency, formatDate } from '@/shared/utils/format';
import { Transaction } from '@/features/transactions/types/transaction';

interface TransactionsListProps {
  transactions: Transaction[];
}

const CATEGORY_PALETTE = [colors.primary, colors.info, colors.secondary, colors.accent, colors.danger];

function getCategoryIcon(category: string): keyof typeof Feather.glyphMap {
  const normalized = category.toLowerCase();
  if (normalized.includes('uber') || normalized.includes('99') || normalized.includes('taxi')) {
    return 'navigation';
  }
  if (normalized.includes('food') || normalized.includes('delivery')) {
    return 'shopping-bag';
  }
  return 'tag';
}

function getCategoryColor(category: string): string {
  let hash = 0;
  for (let i = 0; i < category.length; i += 1) {
    hash = (hash * 31 + category.charCodeAt(i)) % CATEGORY_PALETTE.length;
  }
  return CATEGORY_PALETTE[Math.abs(hash)];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[styles.content, transactions.length === 0 && styles.contentEmpty]}
      ListEmptyComponent={
        <EmptyState
          icon="inbox"
          title="Nenhum lançamento ainda"
          subtitle="Toque no + para registrar seu primeiro ganho ou despesa."
        />
      }
      renderItem={({ item }) => {
        const categoryColor = getCategoryColor(item.category);
        return (
          <Card style={styles.item}>
            <View style={[styles.iconBadge, { backgroundColor: `${categoryColor}26` }]}>
              <Feather name={getCategoryIcon(item.category)} size={18} color={categoryColor} />
            </View>
            <View style={styles.info}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.meta}>
                {formatDate(item.date)}
                {item.ridesCount > 0 ? ` • ${item.ridesCount} corridas` : ''}
              </Text>
              {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
            </View>
            <Text style={[styles.amount, item.type === 'income' ? styles.income : styles.expense]}>
              {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
            </Text>
          </Card>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: 100
  },
  contentEmpty: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: radii.round,
    alignItems: 'center',
    justifyContent: 'center'
  },
  info: {
    flex: 1
  },
  category: {
    color: colors.text,
    fontFamily: font.bold,
    fontSize: 16
  },
  meta: {
    color: colors.textMuted,
    fontFamily: font.regular,
    fontSize: 13,
    marginTop: 2
  },
  description: {
    color: colors.textMuted,
    fontFamily: font.regular,
    fontSize: 13,
    marginTop: 2
  },
  amount: {
    fontSize: 15,
    fontFamily: font.bold
  },
  income: {
    color: colors.success
  },
  expense: {
    color: colors.danger
  }
});
