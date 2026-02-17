import React, { useState } from "react";
import { formatDecimal } from "@/shared/utils";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import {
  AddFixedCostModal,
  FixedCostsList,
} from "@/features/fixedCosts/components";
import { useFixedCosts } from "@/features/fixedCosts/hooks";
import { Card, FloatingActionButton } from "@/shared/components";
import { colors, spacing } from "@/shared/theme";

export default function FixedCostsScreen() {
  const {
    fixedCosts,
    loading,
    addFixedCost,
    deleteFixedCost,
    resetFixedCostPayments,
    totalDailyAmount,
  } = useFixedCosts();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Card>
          <Text style={styles.headerTitle}>Total Diário Necessário</Text>
          <Text style={styles.headerAmount}>
            R$ {formatDecimal(totalDailyAmount)}/dia
          </Text>
          <Text style={styles.headerSubtext}>
            Você precisa fazer este valor por dia para pagar todos os custos
            fixos nos prazos estabelecidos.
          </Text>
        </Card>
      </View>

      <View style={styles.content}>
        <FixedCostsList
          costs={fixedCosts}
          onDelete={deleteFixedCost}
          onReset={resetFixedCostPayments}
        />
      </View>

      <FloatingActionButton onPress={() => setModalOpen(true)} />
      <AddFixedCostModal
        visible={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addFixedCost}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  headerAmount: {
    color: colors.primary,
    fontSize: 32,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  headerSubtext: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
});
