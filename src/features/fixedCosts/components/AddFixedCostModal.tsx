import React, { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/shared/components";
import { colors, font, radii, spacing } from "@/shared/theme";
import { toISODate } from "@/shared/utils/format";
import { FixedCostInput } from "@/features/fixedCosts/types";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

interface AddFixedCostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: FixedCostInput) => Promise<void>;
}

export function AddFixedCostModal({
  visible,
  onClose,
  onSubmit,
}: AddFixedCostModalProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(toISODate());
  const [daysToPayoff, setDaysToPayoff] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const canSubmit = useMemo(() => {
    return (
      Number(value) > 0 &&
      description.trim().length > 0 &&
      Number(daysToPayoff) > 0 &&
      DATE_REGEX.test(startDate)
    );
  }, [value, description, daysToPayoff, startDate]);

  const reset = useCallback(() => {
    setValue("");
    setDescription("");
    setStartDate(toISODate());
    setDaysToPayoff("");
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        value: Number(value),
        description: description.trim(),
        startDate,
        daysToPayoff: Number(daysToPayoff),
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
    value,
    description,
    startDate,
    daysToPayoff,
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
        <SafeAreaView style={styles.sheet} edges={["bottom"]}>
          <View style={styles.dragHandle} />
          <Text style={styles.title}>{t("fixedCosts.modal.title")}</Text>

          <TextInput
            keyboardType="decimal-pad"
            placeholder={t("fixedCosts.modal.valuePlaceholder")}
            placeholderTextColor={colors.textMuted}
            value={value}
            onChangeText={setValue}
            style={styles.input}
          />
          <TextInput
            placeholder={t("fixedCosts.modal.descriptionPlaceholder")}
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />
          <TextInput
            placeholder={t("fixedCosts.modal.startDatePlaceholder")}
            placeholderTextColor={colors.textMuted}
            value={startDate}
            onChangeText={setStartDate}
            style={styles.input}
          />
          <TextInput
            keyboardType="number-pad"
            placeholder={t("fixedCosts.modal.daysToPayoffPlaceholder")}
            placeholderTextColor={colors.textMuted}
            value={daysToPayoff}
            onChangeText={setDaysToPayoff}
            style={styles.input}
          />

          <PrimaryButton
            label={t("fixedCosts.modal.submitButton")}
            onPress={handleSubmit}
            disabled={!canSubmit || isSubmitting}
          />
          <Pressable onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>{t("common.cancel")}</Text>
          </Pressable>
        </SafeAreaView>
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
    gap: spacing.sm,
  },
  dragHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: radii.round,
    backgroundColor: colors.border,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontFamily: font.bold,
    marginBottom: spacing.sm,
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
    fontFamily: font.semibold,
  },
});
