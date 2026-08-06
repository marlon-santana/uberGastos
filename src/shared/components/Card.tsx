import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radii, shadow, spacing } from '@/shared/theme';

interface CardProps extends PropsWithChildren {
  style?: ViewStyle;
  raised?: boolean;
}

export function Card({ children, style, raised }: CardProps) {
  return (
    <View style={[styles.card, raised && styles.raised, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopColor: 'rgba(255,255,255,0.06)',
    padding: spacing.md,
    ...shadow.card
  },
  raised: {
    backgroundColor: colors.surfaceRaised
  }
});