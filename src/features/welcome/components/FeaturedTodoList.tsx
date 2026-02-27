import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { WelcomeBenefit } from "@/features/welcome/types/welcome";
import { colors, spacing } from "@/shared/theme";

interface FeaturedTodoListProps {
  items: WelcomeBenefit[];
}

export function FeaturedTodoList({ items }: FeaturedTodoListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Featured</Text>
      {/* Dedicated checklist component keeps the welcome view focused on layout orchestration. */}
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
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
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
    fontWeight: "500",
  },
});
