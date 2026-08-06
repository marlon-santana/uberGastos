import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from '@/navigation/TabNavigator';
import SplashScreen from '@/features/welcome/components/SplashScreen';
import WelcomeScreen from '@/features/welcome';
import { useWelcome } from '@/features/welcome/hooks';
import { colors } from '@/shared/theme';

export function AppNavigator() {
  const [splashCompleted, setSplashCompleted] = useState<boolean>(false);
  const { started, hydrated } = useWelcome();

  if (!splashCompleted) {
    return <SplashScreen onComplete={() => setSplashCompleted(true)} />;
  }

  if (!hydrated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!started) {
    return <WelcomeScreen />;
  }

  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  }
});