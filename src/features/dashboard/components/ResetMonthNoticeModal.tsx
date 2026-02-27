import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors, radii, spacing } from "@/shared/theme";

interface ResetMonthNoticeModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ResetMonthNoticeModal({
  visible,
  onClose,
}: ResetMonthNoticeModalProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (!visible) {
      opacity.setValue(0);
      scale.setValue(0.95);
      return;
    }

    const enter = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 70,
        useNativeDriver: true,
      }),
    ]);

    enter.start();
  }, [onClose, opacity, scale, visible]);

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.backdrop}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity,
              transform: [{ scale }],
            },
          ]}
        >
          <Text style={styles.title}>Mês resetado</Text>
          <Text style={styles.message}>
            Não se preocupe: o reset zera apenas os valores do mês atual. O
            histórico dos gráficos permanece.
          </Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonLabel}>Fechar</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  },
  title: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },
  message: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  closeButton: {
    marginTop: spacing.md,
    backgroundColor: colors.danger,
    borderRadius: radii.md,
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  closeButtonLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
});
