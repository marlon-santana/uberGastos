import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { TransactionsList } from '@/features/transactions/components/TransactionsList';
import { useTransactions } from '@/features/transactions/hooks/useTransactions';
import { colors, spacing } from '@/shared/theme';

export default function TransactionsScreen() {
  const { transactions, loading } = useTransactions();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TransactionsList transactions={transactions} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  }
});