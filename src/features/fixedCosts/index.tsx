import React, { useState } from "react";
import { formatDecimal } from "@/shared/utils";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import {
  AddFixedCostModal,
  FixedCostsList,
} from "@/features/fixedCosts/components";
import { useFixedCosts } from "@/features/fixedCosts/hooks";
import { useAds } from "@/features/ads/hooks";
import { FixedAdBanner } from "@/features/ads/components";
import { Card, FloatingActionButton } from "@/shared/components";
import { colors, font, spacing } from "@/shared/theme";

export default function FixedCostsScreen() {
  const {
    fixedCosts,
    loading,
    addFixedCost,
    deleteFixedCost,
    resetFixedCostPayments,
    totalDailyAmount,
  } = useFixedCosts();
  const { maybeShowInterstitial } = useAds();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const handleOpenModal = () => {
    maybeShowInterstitial("fixed_costs_open_add_modal", () => {
      setModalOpen(true);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Card raised>
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

      <FixedAdBanner placement="fixed_costs_bottom" />
      <FloatingActionButton onPress={handleOpenModal} />
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
    fontFamily: font.semibold,
    marginBottom: spacing.xs,
  },
  headerAmount: {
    color: colors.primary,
    fontSize: 32,
    fontFamily: font.extrabold,
    marginBottom: spacing.xs,
  },
  headerSubtext: {
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: font.regular,
    lineHeight: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingBottom: 110,
  },
});
