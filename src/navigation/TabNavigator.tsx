import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";
import DashboardScreen from "@/features/dashboard";
import TransactionsScreen from "@/features/transactions";
import FixedCostsScreen from "@/features/fixedCosts";
import SettingsScreen from "@/screens/SettingsScreen";
import { colors } from "@/shared/theme";
import { Feather } from "@expo/vector-icons";

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
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: Platform.OS === "ios" ? 32 : 20, // aumenta o padding para evitar sobreposição
          height: Platform.OS === "ios" ? 100 : 80, // aumenta a altura para acomodar o padding extra
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = "circle";
          if (route.name === "Dashboard") {
            iconName = "grid";
          } else if (route.name === "Historico") {
            iconName = "clock";
          } else if (route.name === "CustoFixo") {
            iconName = "dollar-sign";
          } else if (route.name === "Configuracoes") {
            iconName = "settings";
          }
          // Usando Feather icons
          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen
        name="Historico"
        component={TransactionsScreen}
        options={{ title: "Historico" }}
      />
      <Tab.Screen
        name="CustoFixo"
        component={FixedCostsScreen}
        options={{ title: "Custo Fixo" }}
      />
      <Tab.Screen
        name="Configuracoes"
        component={SettingsScreen}
        options={{ title: "Configuracoes" }}
      />
    </Tab.Navigator>
  );
}
