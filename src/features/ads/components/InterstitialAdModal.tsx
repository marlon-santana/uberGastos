import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useAds } from "@/features/ads/hooks";
import { colors, radii, spacing } from "@/shared/theme";

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
          <Text style={styles.badge}>Anuncio Intersticial</Text>
          <Text style={styles.title}>Dirija com estrategia</Text>
          <Text style={styles.description}>
            Veja como aumentar sua margem diaria usando metas de corridas e custos fixos.
          </Text>
          <Text style={styles.meta}>Origem: {interstitialPlacement || "app"}</Text>

          <Pressable style={styles.button} onPress={closeInterstitial}>
            <Text style={styles.buttonLabel}>Fechar anuncio</Text>
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
  },
  badge: {
    color: colors.info,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  buttonLabel: {
    color: colors.background,
    fontWeight: "700",
    fontSize: 15,
  },
});
