import { Platform } from "react-native";
import { TestIds } from "react-native-google-mobile-ads";

const androidBannerUnitId =
  process.env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID || TestIds.BANNER;
const iosBannerUnitId =
  process.env.EXPO_PUBLIC_ADMOB_BANNER_IOS || TestIds.BANNER;

const androidInterstitialUnitId =
  process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID || TestIds.INTERSTITIAL;
const iosInterstitialUnitId =
  process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_IOS || TestIds.INTERSTITIAL;

export const BANNER_AD_UNIT_ID = Platform.select({
  android: androidBannerUnitId,
  ios: iosBannerUnitId,
  default: TestIds.BANNER,
}) as string;

export const INTERSTITIAL_AD_UNIT_ID = Platform.select({
  android: androidInterstitialUnitId,
  ios: iosInterstitialUnitId,
  default: TestIds.INTERSTITIAL,
}) as string;
