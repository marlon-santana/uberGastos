import React, { useCallback, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { PrimaryButton } from "@/shared/components";
import { colors, radii, spacing } from "@/shared/theme";
import { toISODate } from "@/shared/utils/format";
import {
  TransactionInput,
  TransactionType,
} from "@/features/transactions/types/transaction";

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (type: TransactionType, data: TransactionInput) => Promise<void>;
}

export function AddTransactionModal({
  visible,
  onClose,
  onSubmit,
}: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>("income");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState<string>(toISODate());
  const [description, setDescription] = useState<string>("");

  const canSubmit = useMemo(
    () => Number(amount) > 0 && category.trim().length > 0,
    [amount, category],
  );

  const reset = useCallback(() => {
    setType("income");
    setAmount("");
    setCategory("");
    setDate(toISODate());
    setDescription("");
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) {
      return;
    }

    await onSubmit(type, {
      amount: Number(amount),
      category: category.trim(),
      date,
      description,
    });

    reset();
    onClose();
  }, [
    canSubmit,
    onSubmit,
    type,
    amount,
    category,
    date,
    description,
    reset,
    onClose,
  ]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Novo Lançamento</Text>

          <View style={styles.typeRow}>
            <Pressable
              style={[
                styles.typeButton,
                type === "income" && styles.typeButtonActive,
              ]}
              onPress={() => setType("income")}
            >
              <Text style={styles.typeText}>Ganho</Text>
            </Pressable>
            <Pressable
              style={[
                styles.typeButton,
                type === "expense" && styles.typeButtonExpense,
              ]}
              onPress={() => setType("expense")}
            >
              <Text style={styles.typeText}>Despesa</Text>
            </Pressable>
          </View>

          <TextInput
            keyboardType="decimal-pad"
            placeholder="Valor"
            placeholderTextColor={colors.textMuted}
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
          />
          <TextInput
            placeholder="Categoria"
            placeholderTextColor={colors.textMuted}
            value={category}
            onChangeText={setCategory}
            style={styles.input}
          />
          <TextInput
            placeholder="Data (YYYY-MM-DD)"
            placeholderTextColor={colors.textMuted}
            value={date}
            onChangeText={setDate}
            style={styles.input}
          />
          <TextInput
            placeholder="Descriço (opcional)"
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />

          <PrimaryButton label="Adicionar Lançamento" onPress={handleSubmit} />
          <Pressable onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  typeRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  typeButton: {
    flex: 1,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: colors.success,
  },
  typeButtonExpense: {
    backgroundColor: colors.danger,
  },
  typeText: {
    color: colors.text,
    fontWeight: "600",
  },
  input: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  cancelText: {
    color: colors.textMuted,
    fontWeight: "600",
  },
});
