import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, font, radii, spacing } from '@/shared/theme';

interface CategoryChipsRowProps {
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
  isDeletable?: (value: string) => boolean;
  onDelete?: (value: string) => void;
}

export function CategoryChipsRow({
  items,
  selected,
  onSelect,
  isDeletable,
  onDelete,
}: CategoryChipsRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.row}
    >
      {items.map((item) => {
        const active = item === selected;
        const deletable = Boolean(isDeletable?.(item) && onDelete);

        return (
          <Pressable
            key={item}
            onPress={() => onSelect(item)}
            style={({ pressed }) => [
              styles.chip,
              active && styles.chipActive,
              pressed && styles.chipPressed,
            ]}
          >
            <View style={styles.chipContent}>
              <Text
                style={[styles.chipText, active && styles.chipTextActive]}
              >
                {item}
              </Text>
              {deletable ? (
                <Pressable
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  onPress={() => onDelete?.(item)}
                  style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && styles.deleteButtonPressed,
                  ]}
                >
                  <Feather
                    name="x"
                    size={12}
                    color={active ? colors.onPrimary : colors.textMuted}
                  />
                </Pressable>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const CHIP_HEIGHT = 40;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    flexShrink: 0,
    height: CHIP_HEIGHT + spacing.xs,
  },
  row: {
    flexGrow: 0,
    alignItems: 'center',
    gap: spacing.xs,
    paddingBottom: spacing.xs,
  },
  chip: {
    borderRadius: radii.round,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
    height: CHIP_HEIGHT,
    flexGrow: 0,
    flexShrink: 0,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipPressed: {
    opacity: 0.8,
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  chipText: {
    color: colors.text,
    fontFamily: font.semibold,
    fontSize: 13,
  },
  chipTextActive: {
    color: colors.onPrimary,
  },
  deleteButton: {
    borderRadius: radii.round,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  deleteButtonPressed: {
    opacity: 0.6,
  },
});
