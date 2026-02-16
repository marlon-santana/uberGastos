import { useContext } from 'react';
import { WelcomeContext } from '@/features/welcome/context/WelcomeContext';

export const useWelcome = () => {
  const context = useContext(WelcomeContext);

  if (!context) {
    throw new Error('useWelcome must be used within WelcomeProvider');
  }

  return context;
};