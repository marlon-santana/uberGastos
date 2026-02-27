import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Card } from '@/shared/components';
import { colors, spacing } from '@/shared/theme';
import { formatCurrency, formatDate } from '@/shared/utils/format';
import { Transaction } from '@/features/transactions/types/transaction';

interface TransactionsListProps {
  transactions: Transaction[];
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.content}
      ListEmptyComponent={<Text style={styles.empty}>Nenhum lancamento ainda.</Text>}
      renderItem={({ item }) => (
        <Card style={styles.item}>
          <View>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.meta}>{formatDate(item.date)}</Text>
            <Text style={styles.meta}>Corridas: {item.ridesCount}</Text>
            {item.description ? <Text style={styles.meta}>{item.description}</Text> : null}
          </View>
          <Text style={[styles.amount, item.type === 'income' ? styles.income : styles.expense]}>
            {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
          </Text>
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
  category: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2
  },
  amount: {
    fontSize: 15,
    fontWeight: '700'
  },
  income: {
    color: colors.success
  },
  expense: {
    color: colors.danger
  },
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg
  }
});
