import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, font, spacing } from '@/shared/theme';

interface ChartsToggleHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function ChartsToggleHeader({ collapsed, onToggle }: ChartsToggleHeaderProps) {
  return (
    <Pressable
      style={styles.container}
      onPress={onToggle}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={collapsed ? 'Mostrar gráficos' : 'Ocultar gráficos'}
    >
      <Text style={styles.label}>Gráficos</Text>
      <Feather name={collapsed ? 'chevron-down' : 'chevron-up'} size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm
  },
  label: {
    color: colors.text,
    fontFamily: font.semibold,
    fontSize: 15
  }
});
