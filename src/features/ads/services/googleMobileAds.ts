import { NativeModules } from "react-native";

type GoogleMobileAdsLib = typeof import("react-native-google-mobile-ads");

let cachedLib: GoogleMobileAdsLib | null | undefined;

export function getGoogleMobileAdsLib(): GoogleMobileAdsLib | null {
  if (cachedLib !== undefined) {
    return cachedLib;
  }

  // Expo Go or an outdated native binary may not include this TurboModule.
  if (!NativeModules.RNGoogleMobileAdsModule) {
    cachedLib = null;
    return cachedLib;
  }

  try {
    cachedLib = require("react-native-google-mobile-ads") as GoogleMobileAdsLib;
    return cachedLib;
  } catch {
    cachedLib = null;
    return cachedLib;
  }
}

export function hasGoogleMobileAdsModule(): boolean {
  return Boolean(NativeModules.RNGoogleMobileAdsModule);
}
