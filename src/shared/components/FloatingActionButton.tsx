import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radii } from "@/shared/theme";

interface FloatingActionButtonProps {
  onPress: () => void;
}

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Text style={styles.text}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 20,
    bottom: 40,
    zIndex: 20,
    width: 58,
    height: 58,
    borderRadius: radii.round,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 20,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    color: colors.background,
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 32,
  },
});
