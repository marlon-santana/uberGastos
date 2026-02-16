import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { DashboardProvider } from "@/features/dashboard/context";
import { TransactionsProvider } from "@/features/transactions/context";
import { FixedCostsProvider } from "@/features/fixedCosts/context";
import { WelcomeProvider } from "@/features/welcome/context";
import { AppNavigator } from "@/navigation";
import { useLoadFonts } from "@/shared/hooks/useLoadFonts";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useLoadFonts(() => setFontsLoaded(true));

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <WelcomeProvider>
      <TransactionsProvider>
        <FixedCostsProvider>
          <DashboardProvider>
            <AppNavigator />
            <StatusBar style="light" />
          </DashboardProvider>
        </FixedCostsProvider>
      </TransactionsProvider>
    </WelcomeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
