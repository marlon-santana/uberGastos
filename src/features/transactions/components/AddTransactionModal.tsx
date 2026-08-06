import React, { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { PrimaryButton } from "@/shared/components";
import { colors, font, radii, spacing } from "@/shared/theme";
import { toISODate } from "@/shared/utils/format";
import {
  TransactionInput,
  TransactionType,
} from "@/features/transactions/types/transaction";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const EXPENSE_CATEGORY = "Despesa";

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (type: TransactionType, data: TransactionInput) => Promise<void>;
  categories: string[];
  onAddCategory: (category: string) => Promise<boolean>;
}

export function AddTransactionModal({
  visible,
  onClose,
  onSubmit,
  categories,
  onAddCategory,
}: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>("income");
  const [amount, setAmount] = useState<string>("");
  const [ridesCount, setRidesCount] = useState<string>("");
  const [category, setCategory] = useState<string>(categories[0] || "");
  const [date, setDate] = useState<string>(toISODate());
  const [description, setDescription] = useState<string>("");
  const [showNewCategoryInput, setShowNewCategoryInput] =
    useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const canSubmit = useMemo(
    () => {
      if (!DATE_REGEX.test(date) || Number(amount) <= 0) {
        return false;
      }

      if (type === "expense") {
        return true;
      }

      if (category.trim().length === 0) {
        return false;
      }

      return ridesCount.trim().length > 0 && Number(ridesCount) >= 0;
    },
    [amount, ridesCount, category, type, date],
  );

  const reset = useCallback(() => {
    setType("income");
    setAmount("");
    setRidesCount("");
    setCategory(categories[0] || "");
    setDate(toISODate());
    setDescription("");
    setShowNewCategoryInput(false);
    setNewCategoryName("");
  }, [categories]);

  React.useEffect(() => {
    if (categories.length === 0) {
      setCategory("");
      return;
    }

    if (!category || !categories.includes(category)) {
      setCategory(categories[0]);
    }
  }, [categories, category]);

  const handleAddCategory = useCallback(async () => {
    const normalized = newCategoryName.trim();
    if (!normalized) {
      return;
    }

    const success = await onAddCategory(normalized);
    if (!success) {
      return;
    }

    setCategory(normalized);
    setNewCategoryName("");
    setShowNewCategoryInput(false);
  }, [newCategoryName, onAddCategory]);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(type, {
        amount: Number(amount),
        ridesCount: type === "income" ? Number(ridesCount) : 0,
        category: type === "expense" ? EXPENSE_CATEGORY : category.trim(),
        date,
        description,
      });

      reset();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }, [
    canSubmit,
    isSubmitting,
    onSubmit,
    type,
    amount,
    ridesCount,
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
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.dragHandle} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
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
            {type === "income" ? (
              <TextInput
                keyboardType="number-pad"
                placeholder="Quantidade de corridas do dia"
                placeholderTextColor={colors.textMuted}
                value={ridesCount}
                onChangeText={setRidesCount}
                style={styles.input}
              />
            ) : null}
            {type === "income" ? (
              <>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={category}
                    onValueChange={(value) => setCategory(String(value))}
                    dropdownIconColor={colors.text}
                    style={styles.picker}
                  >
                    {categories.map((item) => (
                      <Picker.Item key={item} label={item} value={item} />
                    ))}
                  </Picker>
                </View>
                <Pressable
                  onPress={() => setShowNewCategoryInput((prev) => !prev)}
                  style={styles.newCategoryButton}
                >
                  <Text style={styles.newCategoryButtonText}>Nova categoria</Text>
                </Pressable>
                {showNewCategoryInput ? (
                  <View style={styles.newCategoryRow}>
                    <TextInput
                      placeholder="Ex: Pizzaria"
                      placeholderTextColor={colors.textMuted}
                      value={newCategoryName}
                      onChangeText={setNewCategoryName}
                      style={[styles.input, styles.newCategoryInput]}
                    />
                    <Pressable
                      onPress={handleAddCategory}
                      style={styles.newCategoryAddButton}
                    >
                      <Text style={styles.newCategoryAddButtonText}>Adicionar</Text>
                    </Pressable>
                  </View>
                ) : null}
              </>
            ) : null}
            <TextInput
              placeholder="Data (YYYY-MM-DD)"
              placeholderTextColor={colors.textMuted}
              value={date}
              onChangeText={setDate}
              style={styles.input}
            />
            <TextInput
              placeholder="Descrição (opcional)"
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />

            <PrimaryButton
              label="Adicionar Lançamento"
              onPress={handleSubmit}
              disabled={!canSubmit || isSubmitting}
            />
            <Pressable onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    maxHeight: "88%",
  },
  dragHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: radii.round,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontFamily: font.bold,
    marginBottom: spacing.sm,
  },
  typeRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  typeButton: {
    flex: 1,
    borderRadius: radii.round,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  typeButtonExpense: {
    backgroundColor: colors.danger,
    borderColor: colors.danger,
  },
  typeText: {
    color: colors.text,
    fontFamily: font.semibold,
  },
  input: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  pickerWrapper: {
    height: 44,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    marginBottom: spacing.sm,
    overflow: "hidden",
    justifyContent: "center",
  },
  picker: {
    color: colors.text,
    marginHorizontal: -spacing.sm,
    marginVertical: -12,
  },
  newCategoryButton: {
    alignSelf: "flex-start",
    borderRadius: radii.round,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  newCategoryButtonText: {
    color: colors.text,
    fontFamily: font.semibold,
  },
  newCategoryRow: {
    flexDirection: "row",
    gap: spacing.xs,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  newCategoryInput: {
    flex: 1,
    marginBottom: 0,
  },
  newCategoryAddButton: {
    borderRadius: radii.round,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  newCategoryAddButtonText: {
    color: colors.onPrimary,
    fontFamily: font.bold,
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  cancelText: {
    color: colors.textMuted,
    fontFamily: font.semibold,
  },
});
