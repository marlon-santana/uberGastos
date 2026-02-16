import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { DashboardProvider } from '@/features/dashboard/context';
import { TransactionsProvider } from '@/features/transactions/context';
import { WelcomeProvider } from '@/features/welcome/context';
import { AppNavigator } from '@/navigation';

export default function App() {
  return (
    <WelcomeProvider>
      <TransactionsProvider>
        <DashboardProvider>
          <AppNavigator />
          <StatusBar style="light" />
        </DashboardProvider>
      </TransactionsProvider>
    </WelcomeProvider>
  );
}
