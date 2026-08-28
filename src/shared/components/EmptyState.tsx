import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, font, radii, spacing } from '@/shared/theme';

interface EmptyStateProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Feather name={icon} size={28} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: radii.round,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md
  },
  title: {
    color: colors.text,
    fontFamily: font.semibold,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.xs
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: font.regular,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 260
  }
});
