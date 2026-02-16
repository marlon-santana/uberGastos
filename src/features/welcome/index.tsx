import React from 'react';
import { WelcomeView } from '@/features/welcome/components/WelcomeView';
import { useWelcome } from '@/features/welcome/hooks/useWelcome';

export default function WelcomeScreen() {
  const { start } = useWelcome();

  return <WelcomeView onStart={start} />;
}