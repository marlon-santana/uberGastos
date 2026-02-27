import React, { useCallback, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
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

  const canSubmit = useMemo(
    () => {
      if (Number(amount) <= 0 || category.trim().length === 0) {
        return false;
      }

      if (type === "expense") {
        return true;
      }

      return ridesCount.trim().length > 0 && Number(ridesCount) >= 0;
    },
    [amount, ridesCount, category, type],
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
    if (!canSubmit) {
      return;
    }

    await onSubmit(type, {
      amount: Number(amount),
      ridesCount: type === "income" ? Number(ridesCount) : 0,
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
          <View style={styles.input}>
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
  picker: {
    color: colors.text,
    marginHorizontal: -spacing.sm,
  },
  newCategoryButton: {
    alignSelf: "flex-start",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  newCategoryButtonText: {
    color: colors.text,
    fontWeight: "600",
  },
  newCategoryRow: {
    flexDirection: "row",
    gap: spacing.xs,
    alignItems: "center",
  },
  newCategoryInput: {
    flex: 1,
  },
  newCategoryAddButton: {
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  newCategoryAddButtonText: {
    color: "#0B1110",
    fontWeight: "700",
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
