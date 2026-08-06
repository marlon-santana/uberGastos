import React, { useMemo } from "react";
import { Image, StyleSheet, Text, View, ScrollView } from "react-native";
import { WelcomeFactory } from "@/features/welcome/factory/WelcomeFactory";
import { WelcomeMessageStrategy } from "@/features/welcome/strategies/WelcomeMessageStrategy";
import { FeaturedTodoList } from "@/features/welcome/components/FeaturedTodoList";
import { PrimaryButton } from "@/shared/components";
import { colors, font, radii, shadow, spacing } from "@/shared/theme";

interface WelcomeViewProps {
  onStart: () => void;
}

export function WelcomeView({ onStart }: WelcomeViewProps) {
  const strategy = useMemo(() => new WelcomeMessageStrategy(), []);
  const benefits = useMemo(() => WelcomeFactory.createBenefits(), []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Image
              source={require("../../../shared/assets/icons/adaptive-icon-foreground.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>{strategy.getTitle()}</Text>
          <Text style={styles.subtitle}>
            Seu aplicativo de controle financeiro para motoristas de aplicativo
          </Text>
        </View>

        <View style={styles.benefitsSection}>
          <FeaturedTodoList items={benefits} />
        </View>

        <View style={styles.footer}>
          <PrimaryButton label="Começar Agora" onPress={onStart} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl * 2,
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 128,
    height: 128,
    borderRadius: radii.round,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadow.primary,
  },
  logoImage: {
    width: 92,
    height: 92,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontFamily: font.extrabold,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    fontFamily: font.regular,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  benefitsSection: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },
});
