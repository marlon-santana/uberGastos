import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { WelcomeBenefit } from "@/features/welcome/types/welcome";
import { colors, font, radii, spacing } from "@/shared/theme";

interface FeaturedTodoListProps {
  items: WelcomeBenefit[];
}

export function FeaturedTodoList({ items }: FeaturedTodoListProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("welcome.why")}</Text>
      {items.map((item) => (
        <View key={item.id} style={styles.row}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontFamily: font.bold,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  emoji: {
    fontSize: 18,
  },
  label: {
    color: colors.text,
    fontSize: 15,
    fontFamily: font.medium,
  },
});
