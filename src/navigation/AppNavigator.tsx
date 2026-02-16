import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from '@/navigation/TabNavigator';
import SplashScreen from '@/features/welcome/components/SplashScreen';
import WelcomeScreen from '@/features/welcome';
import { useWelcome } from '@/features/welcome/hooks';

export function AppNavigator() {
  const [splashCompleted, setSplashCompleted] = useState<boolean>(false);
  const { started } = useWelcome();

  if (!splashCompleted) {
    return <SplashScreen onComplete={() => setSplashCompleted(true)} />;
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