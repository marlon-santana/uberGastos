import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { TransactionsList } from "@/features/transactions/components/TransactionsList";
import { FixedAdBanner } from "@/features/ads/components";
import {
  useCategories,
  useTransactions,
} from "@/features/transactions/hooks";
import { CategoryChipsRow } from "@/shared/components";
import { colors, font, radii, spacing } from "@/shared/theme";

const ALL_CATEGORIES_LABEL = "Todas";

export default function TransactionsScreen() {
  const { transactions, loading, clearTransactions } = useTransactions();
  const { deleteCategory, isCustom } = useCategories();
  const [deleteAllSelected, setDeleteAllSelected] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    ALL_CATEGORIES_LABEL,
  );

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
    if (selectedCategory === ALL_CATEGORIES_LABEL) {
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
      selectedCategory !== ALL_CATEGORIES_LABEL &&
      !categories.includes(selectedCategory)
    ) {
      setSelectedCategory(ALL_CATEGORIES_LABEL);
    }
  }, [categories, selectedCategory]);

  const handleDeleteCategory = (category: string) => {
    Alert.alert(
      "Excluir categoria",
      `Deseja excluir a categoria "${category}"? Os lançamentos já registrados não serão apagados.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            deleteCategory(category);
            if (selectedCategory === category) {
              setSelectedCategory(ALL_CATEGORIES_LABEL);
            }
          },
        },
      ],
    );
  };

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
          style={styles.switchRow}
          onPress={() => setDeleteAllSelected((prev) => !prev)}
        >
          <Switch
            value={deleteAllSelected}
            onValueChange={setDeleteAllSelected}
            trackColor={{ false: colors.surfaceAlt, true: colors.primary }}
            thumbColor={colors.text}
          />
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
          <Text style={styles.deleteButtonLabel}>Limpar histórico</Text>
        </Pressable>
      </View>
      <CategoryChipsRow
        items={[ALL_CATEGORIES_LABEL, ...categories]}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        isDeletable={(category) =>
          category !== ALL_CATEGORIES_LABEL && isCustom(category)
        }
        onDelete={handleDeleteCategory}
      />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  actionLabel: {
    color: colors.text,
    fontFamily: font.semibold,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    borderRadius: radii.round,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: "center",
  },
  deleteButtonDisabled: {
    opacity: 0.45,
  },
  deleteButtonLabel: {
    color: colors.text,
    fontFamily: font.bold,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});
