import React from "react";
import { StyleSheet, View } from "react-native";
import { useAds } from "@/features/ads/hooks";
import { BANNER_AD_UNIT_ID } from "@/features/ads/config";
import { getGoogleMobileAdsLib } from "@/features/ads/services";
import { colors, radii, spacing } from "@/shared/theme";

interface FixedAdBannerProps {
  placement: string;
}

export function FixedAdBanner({ placement }: FixedAdBannerProps) {
  const { adsEnabled } = useAds();
  const adsLib = getGoogleMobileAdsLib();

  if (!adsEnabled || !adsLib) {
    return null;
  }

  const BannerAd = adsLib.BannerAd;
  const BannerAdSize = adsLib.BannerAdSize;

  return (
    <View style={styles.wrapper} testID={`ad-banner-${placement}`}>
      <View style={styles.banner}>
        <BannerAd
          unitId={BANNER_AD_UNIT_ID}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
  },
  banner: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
});
