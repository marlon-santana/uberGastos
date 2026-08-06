import React from "react";
import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { Feather } from "@expo/vector-icons";
import { colors, font, radii, shadow, spacing } from "@/shared/theme";

interface CongratsModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get("window");

export function CongratsModal({ visible, onClose }: CongratsModalProps) {
  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <ConfettiCannon
          count={80}
          origin={{ x: width / 2, y: 0 }}
          fadeOut
          fallSpeed={2600}
          colors={[colors.primary, colors.accent, colors.secondary, colors.success]}
        />
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Feather name="award" size={32} color={colors.primary} />
          </View>
          <Text style={styles.title}>Primeiro lançamento registrado!</Text>
          <Text style={styles.message}>
            Você começou a controlar seus ganhos e despesas. Continue
            registrando todos os dias para acompanhar seu lucro real.
          </Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonLabel}>Continuar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: "center",
    ...shadow.card,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: radii.round,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontFamily: font.extrabold,
    fontSize: 19,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  message: {
    color: colors.textMuted,
    fontFamily: font.regular,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.round,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
  },
  closeButtonLabel: {
    color: colors.onPrimary,
    fontFamily: font.bold,
    fontSize: 15,
  },
});
