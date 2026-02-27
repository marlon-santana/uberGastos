import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TransactionsList } from "@/features/transactions/components/TransactionsList";
import { FixedAdBanner } from "@/features/ads/components";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { colors, spacing } from "@/shared/theme";

export default function TransactionsScreen() {
  const { transactions, loading, clearTransactions } = useTransactions();
  const [deleteAllSelected, setDeleteAllSelected] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const valid: string[] = [];

    transactions.forEach((item) => {
      const normalized = item.category.trim();
      if (!normalized) {
        return;
      }

      const key = normalized.toLowerCase();
      if (seen.has(key)) {
        return;
      }

      seen.add(key);
      valid.push(normalized);
    });

    return valid;
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (selectedCategory === "Todas") {
      return transactions;
    }

    return transactions.filter(
      (item) =>
        item.category.trim().toLowerCase() ===
        selectedCategory.trim().toLowerCase(),
    );
  }, [selectedCategory, transactions]);

  React.useEffect(() => {
    if (
      selectedCategory !== "Todas" &&
      !categories.includes(selectedCategory)
    ) {
      setSelectedCategory("Todas");
    }
  }, [categories, selectedCategory]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.actionsRow}>
        <Pressable
          style={styles.radioRow}
          onPress={() => setDeleteAllSelected((prev) => !prev)}
        >
          <View
            style={[
              styles.radioOuter,
              deleteAllSelected && styles.radioOuterSelected,
            ]}
          >
            {deleteAllSelected ? <View style={styles.radioInner} /> : null}
          </View>
          <Text style={styles.actionLabel}>Deletar todos</Text>
        </Pressable>
        <Pressable
          onPress={async () => {
            await clearTransactions();
            setDeleteAllSelected(false);
          }}
          disabled={!deleteAllSelected}
          style={[
            styles.deleteButton,
            !deleteAllSelected && styles.deleteButtonDisabled,
          ]}
        >
          <Text style={styles.deleteButtonLabel}>Limpar historico</Text>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryChipsRow}
      >
        {["Todas", ...categories].map((category) => (
          <Pressable
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive,
              ]}
            >
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <TransactionsList transactions={filteredTransactions} />
      <FixedAdBanner placement="transactions_bottom" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: 20,
    paddingBottom: 110,
  },
  actionsRow: {
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  actionLabel: {
    color: colors.text,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: colors.danger,
    borderRadius: 10,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  deleteButtonDisabled: {
    opacity: 0.45,
  },
  deleteButtonLabel: {
    color: colors.text,
    fontWeight: "700",
  },
  categoryChipsRow: {
    gap: spacing.xs,
    paddingBottom: spacing.sm,
    height: 46,
  },
  categoryChip: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.surface,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 13,
  },
  categoryChipTextActive: {
    color: "#0B1110",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
