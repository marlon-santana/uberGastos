import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Platform } from "react-native";
import DashboardScreen from "@/features/dashboard";
import TransactionsScreen from "@/features/transactions";
import FixedCostsScreen from "@/features/fixedCosts";
import SettingsScreen from "@/screens/SettingsScreen";
import { useAds } from "@/features/ads/hooks";
import { colors, font } from "@/shared/theme";
import { Feather } from "@expo/vector-icons";

export type RootTabParamList = {
  Dashboard: undefined;
  Historico: undefined;
  CustoFixo: undefined;
  Configuracoes: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function TabNavigator() {
  const { maybeShowInterstitial } = useAds();

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
          fontFamily: font.semibold,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Feather.glyphMap = "circle";
          if (route.name === "Dashboard") {
            iconName = "bar-chart-2";
          } else if (route.name === "Historico") {
            iconName = "list";
          } else if (route.name === "CustoFixo") {
            iconName = "repeat";
          } else if (route.name === "Configuracoes") {
            iconName = "settings";
          }
          // Usando Feather icons
          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        listeners={{
          tabPress: () => maybeShowInterstitial("tab_dashboard"),
        }}
      />
      <Tab.Screen
        name="Historico"
        component={TransactionsScreen}
        options={{ title: "Historico" }}
        listeners={{
          tabPress: () => maybeShowInterstitial("tab_historico"),
        }}
      />
      <Tab.Screen
        name="CustoFixo"
        component={FixedCostsScreen}
        options={{ title: "Custo Fixo" }}
        listeners={{
          tabPress: () => maybeShowInterstitial("tab_custo_fixo"),
        }}
      />
      <Tab.Screen
        name="Configuracoes"
        component={SettingsScreen}
        options={{ title: "Configuracoes" }}
        listeners={{
          tabPress: () => maybeShowInterstitial("tab_configuracoes"),
        }}
      />
    </Tab.Navigator>
  );
}
