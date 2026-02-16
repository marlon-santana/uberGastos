import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/shared/theme';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const letterAnims = useRef(
    Array.from({ length: 9 }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true
      })
    ]).start();

    const letterSequence = letterAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 80,
        useNativeDriver: true
      })
    );

    const timeoutIds: Array<ReturnType<typeof setTimeout>> = [];

    const firstTimeout = setTimeout(() => {
      Animated.parallel(letterSequence).start(() => {
        const secondTimeout = setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
          }).start(() => {
            onComplete();
          });
        }, 1000);
        timeoutIds.push(secondTimeout);
      });
    }, 600);

    timeoutIds.push(firstTimeout);

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [fadeAnim, scaleAnim, letterAnims, onComplete]);

  const letters = 'INOVACODE'.split('');

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{'{ }'}</Text>
        </View>

        <View style={styles.nameContainer}>
          {letters.map((letter, index) => (
            <Animated.Text
              key={index}
              style={[
                styles.letter,
                {
                  opacity: letterAnims[index],
                  transform: [
                    {
                      translateY: letterAnims[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0]
                      })
                    }
                  ]
                }
              ]}
            >
              {letter}
            </Animated.Text>
          ))}
        </View>

        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: fadeAnim
            }
          ]}
        >
          Innovation in every line of code
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoContainer: {
    alignItems: 'center'
  },
  iconContainer: {
    marginBottom: 20
  },
  icon: {
    fontSize: 72,
    fontWeight: '700',
    color: colors.accent
  },
  nameContainer: {
    flexDirection: 'row',
    marginBottom: 16
  },
  letter: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: 2
  },
  tagline: {
    fontSize: 14,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8
  }
});
