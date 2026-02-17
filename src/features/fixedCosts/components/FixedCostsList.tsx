import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Card } from "@/shared/components";
import { colors, spacing } from "@/shared/theme";
import { FixedCost } from "@/features/fixedCosts/types";
import { useFixedCosts } from "@/features/fixedCosts/hooks";

interface FixedCostsListProps {
  costs: FixedCost[];
  onDelete: (id: string) => void;
  onReset: (id: string) => void;
}

export function FixedCostsList({ costs, onDelete, onReset }: FixedCostsListProps) {
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
        <Text style={styles.emptyText}>Nenhum custo fixo cadastrado.</Text>
        <Text style={styles.emptySubtext}>
          Adicione um custo fixo para calcular quanto você precisa fazer por
          dia.
        </Text>
      </Card>
    );
  }

  return (
    <FlatList
      data={costs}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      keyboardShouldPersistTaps="handled"
      renderItem={({ item }) => {
        // Calcular total já pago
        const totalPaid =
          item.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
        const remaining = item.value - totalPaid;
        const isFullyPaid = totalPaid >= item.value;
        const daysLeft = Math.max(
          item.daysToPayoff - (item.payments?.length || 0),
          1,
        );
        const dailyValue = remaining / daysLeft;
        return (
          <Card style={isFullyPaid ? styles.fullyPaidCard : undefined}>
            <View style={styles.itemHeader}>
              <View style={styles.itemInfo}>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.value}>
                  R$ {remaining.toFixed(2)}{" "}
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                    (restante)
                  </Text>
                </Text>
                {totalPaid > 0 && (
                  <Text style={styles.paidText}>
                    Pago: R$ {totalPaid.toFixed(2)}
                  </Text>
                )}
                {isFullyPaid && (
                  <Text style={styles.fullyPaidText}>
                    ✓ Totalmente Pago
                  </Text>
                )}
              </View>
              <View style={styles.actionButtons}>
                {isFullyPaid && (
                  <Pressable
                    onPress={() => onReset(item.id)}
                    style={styles.resetButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Feather name="rotate-ccw" size={20} color={colors.primary} />
                  </Pressable>
                )}
                <Pressable
                  onPress={() => onDelete(item.id)}
                  style={styles.deleteButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather name="trash-2" size={20} color="#FF5C5C" />
                </Pressable>
              </View>
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
                <Text style={styles.detailValue}>{daysLeft} dias</Text>
              </View>
              <View style={[styles.detailRow, styles.highlightRow]}>
                <Text style={styles.highlightLabel}>Valor diário:</Text>
                <Text style={styles.highlightValue}>
                  R$ {dailyValue.toFixed(2)}/dia
                </Text>
              </View>
              <View style={styles.paymentInputRow}>
                <TextInput
                  style={styles.paymentInput}
                  placeholder="Lançar pagamento (R$)"
                  keyboardType="decimal-pad"
                  value={paymentInputs[item.id] || ""}
                  onChangeText={(text) =>
                    setPaymentInputs((prev) => ({ ...prev, [item.id]: text }))
                  }
                />
                <Pressable
                  style={styles.paymentButton}
                  onPress={() => handleAddPayment(item.id)}
                  disabled={
                    !paymentInputs[item.id] ||
                    isNaN(Number(paymentInputs[item.id])) ||
                    Number(paymentInputs[item.id]) <= 0
                  }
                >
                  <Text style={styles.paymentButtonText}>Lançar</Text>
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
  emptyText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
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
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  value: {
    color: colors.danger,
    fontSize: 18,
    fontWeight: "700",
  },
  paidText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  fullyPaidText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: spacing.xs,
    alignItems: "center",
  },
  resetButton: {
    padding: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  deleteButton: {
    padding: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FF5C5C',
  },
  paymentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  paymentInput: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  paymentButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginLeft: spacing.xs,
  },
  paymentButtonText: {
    color: "#fff",
    fontWeight: "700",
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
  },
  detailValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "500",
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
    fontWeight: "600",
  },
  highlightValue: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
});
