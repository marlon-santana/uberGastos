import React from "react";
import i18n from "@/shared/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { DashboardProvider } from "@/features/dashboard/context";
import {
  TransactionsProvider,
  CategoriesProvider,
} from "@/features/transactions/context";
import { FixedCostsProvider } from "@/features/fixedCosts/context";
import { WelcomeProvider } from "@/features/welcome/context";
import { AdsProvider } from "@/features/ads/context";
import { AppNavigator } from "@/navigation";
import { useLoadFonts } from "@/shared/hooks/useLoadFonts";
import { withStallion } from "react-native-stallion";

const LANGUAGE_STORAGE_KEY = "@drivercash:language";

function App() {
  const fontsLoaded = useLoadFonts();

  React.useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      .then((stored) => {
        if (stored) {
          i18n.changeLanguage(stored);
        }
      })
      .catch((error) => {
        console.error("Failed to load language preference", error);
      });
  }, []);

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
              <CategoriesProvider>
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
              </CategoriesProvider>
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

export default withStallion(App);
