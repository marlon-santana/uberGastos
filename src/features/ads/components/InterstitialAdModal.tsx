import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useAds } from "@/features/ads/hooks";
import { colors, font, radii, shadow, spacing } from "@/shared/theme";

export function InterstitialAdModal() {
  const { adsEnabled, isInterstitialVisible, interstitialPlacement, closeInterstitial } =
    useAds();

  if (!adsEnabled) {
    return null;
  }

  return (
    <Modal
      visible={isInterstitialVisible}
      animationType="fade"
      transparent
      onRequestClose={closeInterstitial}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.badge}>Anúncio Intersticial</Text>
          <Text style={styles.title}>Dirija com estratégia</Text>
          <Text style={styles.description}>
            Veja como aumentar sua margem diária usando metas de corridas e custos fixos.
          </Text>
          <Text style={styles.meta}>Origem: {interstitialPlacement || "app"}</Text>

          <Pressable style={styles.button} onPress={closeInterstitial}>
            <Text style={styles.buttonLabel}>Fechar anúncio</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  card: {
    width: "100%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  badge: {
    color: colors.info,
    fontSize: 12,
    fontFamily: font.bold,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontFamily: font.extrabold,
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.textMuted,
    fontFamily: font.regular,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  meta: {
    color: colors.textMuted,
    fontFamily: font.regular,
    fontSize: 12,
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.round,
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  buttonLabel: {
    color: colors.onPrimary,
    fontFamily: font.bold,
    fontSize: 15,
  },
});
