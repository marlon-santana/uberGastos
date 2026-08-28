import React, { useState } from "react";
import { formatDateBR } from '@/shared/utils';
import { formatDecimal } from "@/shared/utils";
import { parseISODateLocal } from "@/shared/utils/format";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Card, EmptyState } from "@/shared/components";
import { colors, font, radii, spacing } from "@/shared/theme";
import { FixedCost } from "@/features/fixedCosts/types";
import { useFixedCosts } from "@/features/fixedCosts/hooks";

interface FixedCostsListProps {
  costs: FixedCost[];
  onDelete: (id: string) => void;
  onReset: (id: string) => void;
}

export function FixedCostsList({
  costs,
  onDelete,
  onReset,
}: FixedCostsListProps) {
  const { t } = useTranslation();
  const [paymentInputs, setPaymentInputs] = useState<{ [id: string]: string }>(
    {},
  );
  const { addPaymentToFixedCost } = useFixedCosts();

  const handleAddPayment = async (costId: string) => {
    const value = Number(paymentInputs[costId]);
    if (!value || value <= 0) return;
    await addPaymentToFixedCost(costId, value);
    setPaymentInputs((prev) => ({ ...prev, [costId]: "" }));
  };

  if (costs.length === 0) {
    return (
      <Card>
        <EmptyState
          icon="credit-card"
          title={t("fixedCosts.list.emptyTitle")}
          subtitle={t("fixedCosts.list.emptySubtitle")}
        />
      </Card>
    );
  }

  return (
    <FlatList
      data={costs}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      nestedScrollEnabled={true}
      removeClippedSubviews={false}
      renderItem={({ item }) => {
        // Calcular total já pago
        const totalPaid =
          item.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
        const remaining = Math.max(item.value - totalPaid, 0);
        const isFullyPaid = totalPaid >= item.value;
        const daysLeft = Math.max(
          Math.ceil(
            (parseISODateLocal(item.endDate).getTime() - Date.now()) /
              (24 * 60 * 60 * 1000),
          ),
          1,
        );
        const dailyValue = remaining / daysLeft;
        return (
          <Card style={isFullyPaid ? styles.fullyPaidCard : undefined}>
            <View style={styles.itemHeader}>
              <View style={styles.itemInfo}>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.value}>
                  R$ {formatDecimal(remaining)}{" "}
                  <Text style={styles.remainingLabel}>
                    {t("fixedCosts.list.remainingLabel")}
                  </Text>
                </Text>
                {totalPaid > 0 && (
                  <Text style={styles.paidText}>
                    {t("fixedCosts.list.paidLabel")} R$ {formatDecimal(totalPaid)}
                  </Text>
                )}
                {isFullyPaid && (
                  <Text style={styles.fullyPaidText}>
                    {t("fixedCosts.list.fullyPaidLabel")}
                  </Text>
                )}
              </View>
              <View style={styles.actionButtons}>
                {isFullyPaid && (
                  <Pressable
                    onPress={() => onReset(item.id)}
                    style={({ pressed }) => [
                      styles.resetButton,
                      pressed && styles.pressed,
                    ]}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Feather
                      name="rotate-ccw"
                      size={20}
                      color={colors.primary}
                    />
                  </Pressable>
                )}
                <Pressable
                  onPress={() => onDelete(item.id)}
                  style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && styles.pressed,
                  ]}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather name="trash-2" size={20} color={colors.danger} />
                </Pressable>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.itemDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {t("fixedCosts.list.startDateLabel")}
                </Text>
                <Text style={styles.detailValue}>{formatDateBR(item.startDate)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {t("fixedCosts.list.endDateLabel")}
                </Text>
                <Text style={styles.detailValue}>{formatDateBR(item.endDate)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {t("fixedCosts.list.daysToPayLabel")}
                </Text>
                <Text style={styles.detailValue}>
                  {daysLeft} {t("fixedCosts.list.daysSuffix")}
                </Text>
              </View>
              <View style={[styles.detailRow, styles.highlightRow]}>
                <Text style={styles.highlightLabel}>
                  {t("fixedCosts.list.dailyValueLabel")}
                </Text>
                <Text style={styles.highlightValue}>
                  R$ {formatDecimal(dailyValue)}
                  {t("fixedCosts.list.dailyValueSuffix")}
                </Text>
              </View>
              <View style={styles.paymentInputRow}>
                <TextInput
                  style={styles.paymentInput}
                  placeholder={t("fixedCosts.list.paymentPlaceholder")}
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  value={paymentInputs[item.id] || ""}
                  onChangeText={(text) =>
                    setPaymentInputs((prev) => ({ ...prev, [item.id]: text }))
                  }
                  returnKeyType="done"
                  blurOnSubmit={false}
                />
                <Pressable
                  style={({ pressed }) => [
                    styles.paymentButton,
                    pressed && styles.pressed,
                    (!paymentInputs[item.id] ||
                      isNaN(Number(paymentInputs[item.id])) ||
                      Number(paymentInputs[item.id]) <= 0) &&
                      styles.paymentButtonDisabled,
                  ]}
                  onPress={() => handleAddPayment(item.id)}
                  disabled={
                    !paymentInputs[item.id] ||
                    isNaN(Number(paymentInputs[item.id])) ||
                    Number(paymentInputs[item.id]) <= 0
                  }
                >
                  <Text style={styles.paymentButtonText}>
                    {t("fixedCosts.list.paymentButton")}
                  </Text>
                </Pressable>
              </View>
            </View>
          </Card>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  fullyPaidCard: {
    borderWidth: 2,
    borderColor: colors.success,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  itemInfo: {
    flex: 1,
  },
  description: {
    color: colors.text,
    fontSize: 16,
    fontFamily: font.semibold,
    marginBottom: spacing.xs,
  },
  value: {
    color: colors.danger,
    fontSize: 18,
    fontFamily: font.bold,
  },
  remainingLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: font.regular,
  },
  paidText: {
    color: colors.success,
    fontSize: 13,
    fontFamily: font.semibold,
    marginTop: 2,
  },
  fullyPaidText: {
    color: colors.success,
    fontSize: 14,
    fontFamily: font.bold,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: spacing.xs,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  resetButton: {
    padding: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.sm,
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  deleteButton: {
    padding: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.sm,
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.danger,
  },
  paymentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  paymentInput: {
    flex: 1,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  paymentButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginLeft: spacing.xs,
  },
  paymentButtonDisabled: {
    opacity: 0.45,
  },
  paymentButtonText: {
    color: colors.onPrimary,
    fontFamily: font.bold,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  itemDetails: {
    gap: spacing.xs,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 14,
    fontFamily: font.regular,
  },
  detailValue: {
    color: colors.text,
    fontSize: 14,
    fontFamily: font.medium,
  },
  highlightRow: {
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  highlightLabel: {
    color: colors.text,
    fontSize: 15,
    fontFamily: font.semibold,
  },
  highlightValue: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: font.bold,
  },
});
