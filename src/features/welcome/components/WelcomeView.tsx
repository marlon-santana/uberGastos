import React, { useMemo } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { WelcomeFactory } from "@/features/welcome/factory/WelcomeFactory";
import { WelcomeMessageStrategy } from "@/features/welcome/strategies/WelcomeMessageStrategy";
import { FeaturedTodoList } from "@/features/welcome/components/FeaturedTodoList";
import { PrimaryButton } from "@/shared/components";
import { colors, spacing } from "@/shared/theme";

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
            <Feather name="dollar-sign" size={48} color={colors.primary} />
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
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
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
