import React from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/shared/theme";

interface MoneyRainProps {
  visible: boolean;
}

type DropParticle = {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
};

const PARTICLES: DropParticle[] = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  left: 8 + Math.random() * 84,
  size: 16 + Math.round(Math.random() * 10),
  delay: Math.round(Math.random() * 1100),
  duration: 1800 + Math.round(Math.random() * 1700),
}));

export function MoneyRain({ visible }: MoneyRainProps) {
  const screenHeight = Dimensions.get("window").height;
  const animations = React.useRef(
    PARTICLES.map(() => new Animated.Value(-40)),
  ).current;
  const opacities = React.useRef(PARTICLES.map(() => new Animated.Value(0)))
    .current;

  React.useEffect(() => {
    if (!visible) {
      return;
    }

    const running = PARTICLES.map((particle, index) =>
      Animated.sequence([
        Animated.delay(particle.delay),
        Animated.parallel([
          Animated.timing(animations[index], {
            toValue: screenHeight + 40,
            duration: particle.duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacities[index], {
              toValue: 1,
              duration: 260,
              useNativeDriver: true,
            }),
            Animated.timing(opacities[index], {
              toValue: 0,
              duration: Math.max(500, particle.duration - 260),
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]),
    );

    const group = Animated.stagger(55, running);
    group.start();

    return () => {
      group.stop();
    };
  }, [animations, opacities, screenHeight, visible]);

  React.useEffect(() => {
    if (!visible) {
      animations.forEach((value) => value.setValue(-40));
      opacities.forEach((value) => value.setValue(0));
    }
  }, [animations, opacities, visible]);

  if (!visible) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.overlay}>
      {PARTICLES.map((particle, index) => (
        <Animated.View
          key={particle.id}
          style={[
            styles.particle,
            {
              left: `${particle.left}%`,
              transform: [{ translateY: animations[index] }],
              opacity: opacities[index],
            },
          ]}
        >
          <Feather name="dollar-sign" size={particle.size} color={colors.primary} />
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  particle: {
    position: "absolute",
    top: -40,
  },
});
