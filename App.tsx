import React from "react";
import "@/shared/i18n";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { DashboardProvider } from "@/features/dashboard/context";
import { TransactionsProvider } from "@/features/transactions/context";
import { FixedCostsProvider } from "@/features/fixedCosts/context";
import { WelcomeProvider } from "@/features/welcome/context";
import { AdsProvider } from "@/features/ads/context";
import { AppNavigator } from "@/navigation";
import { useLoadFonts } from "@/shared/hooks/useLoadFonts";

export default function App() {
  const fontsLoaded = useLoadFonts();

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1 }}
        edges={["top", "left", "right", "bottom"]}
      >
        <WelcomeProvider>
          <AdsProvider>
            <TransactionsProvider>
              <FixedCostsProvider>
                <DashboardProvider>
                  <AppNavigator />
                  <StatusBar
                    style="light"
                    translucent
                    backgroundColor="transparent"
                  />
                </DashboardProvider>
              </FixedCostsProvider>
            </TransactionsProvider>
          </AdsProvider>
        </WelcomeProvider>
      </SafeAreaView>
    </SafeAreaProvider>
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
