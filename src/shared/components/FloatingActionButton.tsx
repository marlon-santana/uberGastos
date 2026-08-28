import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";
import { colors, font, radii, shadow } from "@/shared/theme";

interface FloatingActionButtonProps {
  onPress: () => void;
}

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) => {
    Animated.spring(scale, {
      toValue,
      friction: 6,
      tension: 90,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
      <Pressable
        style={styles.button}
        onPress={onPress}
        onPressIn={() => animateTo(0.92)}
        onPressOut={() => animateTo(1)}
      >
        <Text style={styles.text}>+</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    right: 20,
    bottom: 40,
    zIndex: 20,
    ...shadow.primary,
  },
  button: {
    width: 58,
    height: 58,
    borderRadius: radii.round,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: colors.onPrimary,
    fontSize: 30,
    fontFamily: font.bold,
    lineHeight: 32,
  },
});
