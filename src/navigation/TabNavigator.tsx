import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '@/features/dashboard';
import TransactionsScreen from '@/features/transactions';
import FixedCostsScreen from '@/features/fixedCosts';
import SettingsScreen from '@/screens/SettingsScreen';
import { colors } from '@/shared/theme';

export type RootTabParamList = {
  Dashboard: undefined;
  Historico: undefined;
  CustoFixo: undefined;
  Configuracoes: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Historico" component={TransactionsScreen} options={{ title: 'Historico' }} />
      <Tab.Screen name="CustoFixo" component={FixedCostsScreen} options={{ title: 'Custo Fixo' }} />
      <Tab.Screen name="Configuracoes" component={SettingsScreen} options={{ title: 'Configuracoes' }} />
    </Tab.Navigator>
  );
}