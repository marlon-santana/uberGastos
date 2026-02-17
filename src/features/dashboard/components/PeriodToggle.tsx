import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Period } from '@/shared/types/common';
import { colors, radii, spacing } from '@/shared/theme';

interface PeriodToggleProps {
  selected: Period;
  onChange: (period: Period) => void;
}

export function PeriodToggle({ selected, onChange }: PeriodToggleProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.option, selected === 'weekly' && styles.active]}
        onPress={() => onChange('weekly')}
        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
      >
        <Text style={[styles.label, selected === 'weekly' && styles.activeLabel]}>Semanal</Text>
      </Pressable>
      <Pressable
        style={[styles.option, selected === 'monthly' && styles.active]}
        onPress={() => onChange('monthly')}
        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
      >
        <Text style={[styles.label, selected === 'monthly' && styles.activeLabel]}>Mensal</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 4,
    marginBottom: spacing.md
  },
  option: {
    flex: 1,
    borderRadius: radii.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center'
  },
  active: {
    backgroundColor: colors.primary
  },
  label: {
    color: colors.text,
    fontWeight: '600'
  },
  activeLabel: {
    color: '#0B1110'
  }
});