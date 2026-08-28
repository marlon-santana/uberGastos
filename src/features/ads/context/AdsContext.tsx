import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { INTERSTITIAL_AD_UNIT_ID } from "@/features/ads/config";
import { getGoogleMobileAdsLib } from "@/features/ads/services";

type CouponResult = "enabled" | "disabled" | "invalid";

interface AdsContextValue {
  adsEnabled: boolean;
  isInterstitialVisible: boolean;
  interstitialPlacement: string | null;
  maybeShowInterstitial: (placement: string, afterClose?: () => void) => boolean;
  closeInterstitial: () => void;
  applyCoupon: (code: string) => Promise<CouponResult>;
}

const ADS_STORAGE_KEY = "@drivercash:ads-enabled";

const AdsContext = createContext<AdsContextValue | undefined>(undefined);

export function AdsProvider({ children }: PropsWithChildren) {
  const [adsEnabled, setAdsEnabled] = useState<boolean>(true);
  const [isInterstitialVisible, setIsInterstitialVisible] =
    useState<boolean>(false);
  const [interstitialPlacement, setInterstitialPlacement] = useState<
    string | null
  >(null);
  const [interstitialCount, setInterstitialCount] = useState<number>(0);
  const afterCloseRef = useRef<(() => void) | undefined>(undefined);
  const interstitialRef = useRef<{
    show: () => Promise<void>;
    load: () => void;
  } | null>(null);
  const loadedRef = useRef<boolean>(false);
  const shouldShowRef = useRef<boolean>(false);
  const unsubscribeRef = useRef<Array<() => void>>([]);

  const executeAfterClose = useCallback(() => {
    const pending = afterCloseRef.current;
    afterCloseRef.current = undefined;
    pending?.();
  }, []);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        const stored = await AsyncStorage.getItem(ADS_STORAGE_KEY);
        if (mounted && stored !== null) {
          setAdsEnabled(stored === "true");
        }
      } catch (error) {
        console.error("Failed to load ads settings", error);
      }
    };

    hydrate();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const adsLib = getGoogleMobileAdsLib();
    if (!adsLib) {
      return;
    }

    adsLib
      .MobileAds()
      .initialize()
      .catch((error: unknown) => {
        console.error("Failed to initialize Google Mobile Ads", error);
      });
  }, []);

  const persistAdsState = useCallback(async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem(ADS_STORAGE_KEY, String(enabled));
    } catch (error) {
      console.error("Failed to persist ads settings", error);
    }
  }, []);

  const buildAndLoadInterstitial = useCallback(() => {
    const adsLib = getGoogleMobileAdsLib();
    if (!adsLib) {
      return;
    }

    unsubscribeRef.current.forEach((unsubscribe) => unsubscribe());
    unsubscribeRef.current = [];

    const interstitial = adsLib.InterstitialAd.createForAdRequest(
      INTERSTITIAL_AD_UNIT_ID,
      {
        requestNonPersonalizedAdsOnly: true,
      },
    );

    const onLoaded = interstitial.addAdEventListener(adsLib.AdEventType.LOADED, () => {
      loadedRef.current = true;
      if (shouldShowRef.current) {
        interstitial.show().catch((error: unknown) => {
          console.error("Failed to show interstitial ad", error);
          shouldShowRef.current = false;
          executeAfterClose();
        });
      }
    });

    const onOpened = interstitial.addAdEventListener(adsLib.AdEventType.OPENED, () => {
      setIsInterstitialVisible(true);
    });

    const onClosed = interstitial.addAdEventListener(adsLib.AdEventType.CLOSED, () => {
      setIsInterstitialVisible(false);
      setInterstitialPlacement(null);
      loadedRef.current = false;
      shouldShowRef.current = false;
      executeAfterClose();
      buildAndLoadInterstitial();
    });

    const onError = interstitial.addAdEventListener(
      adsLib.AdEventType.ERROR,
      (error) => {
        console.error("Interstitial ad error", error);
        setIsInterstitialVisible(false);
        setInterstitialPlacement(null);
        loadedRef.current = false;
        shouldShowRef.current = false;
        executeAfterClose();
        buildAndLoadInterstitial();
      },
    );

    interstitialRef.current = interstitial;
    unsubscribeRef.current = [onLoaded, onOpened, onClosed, onError];
    interstitial.load();
  }, [executeAfterClose]);

  useEffect(() => {
    if (!adsEnabled) {
      unsubscribeRef.current.forEach((unsubscribe) => unsubscribe());
      unsubscribeRef.current = [];
      interstitialRef.current = null;
      loadedRef.current = false;
      shouldShowRef.current = false;
      setIsInterstitialVisible(false);
      setInterstitialPlacement(null);
      return;
    }

    buildAndLoadInterstitial();

    return () => {
      unsubscribeRef.current.forEach((unsubscribe) => unsubscribe());
      unsubscribeRef.current = [];
      interstitialRef.current = null;
      loadedRef.current = false;
      shouldShowRef.current = false;
    };
  }, [adsEnabled, buildAndLoadInterstitial]);

  const maybeShowInterstitial = useCallback(
    (placement: string, afterClose?: () => void) => {
      if (!adsEnabled || isInterstitialVisible) {
        afterClose?.();
        return false;
      }

      const nextCount = interstitialCount + 1;
      setInterstitialCount(nextCount);

      // Show an interstitial every 3 eligible actions to reduce friction.
      if (nextCount % 3 !== 0) {
        afterClose?.();
        return false;
      }

      afterCloseRef.current = afterClose;
      setInterstitialPlacement(placement);
      shouldShowRef.current = true;

      const interstitial = interstitialRef.current;
      if (interstitial && loadedRef.current) {
        interstitial.show().catch((error: unknown) => {
          console.error("Failed to show interstitial ad", error);
          shouldShowRef.current = false;
          setInterstitialPlacement(null);
          executeAfterClose();
        });
      } else if (interstitial) {
        interstitial.load();
      } else {
        // AdMob native module unavailable (e.g. Expo Go) - never block the user's action.
        shouldShowRef.current = false;
        setInterstitialPlacement(null);
        executeAfterClose();
      }

      return true;
    },
    [adsEnabled, executeAfterClose, interstitialCount, isInterstitialVisible],
  );

  const closeInterstitial = useCallback(() => {
    executeAfterClose();
  }, [executeAfterClose]);

  const applyCoupon = useCallback(
    async (code: string): Promise<CouponResult> => {
      const normalized = code.trim().toUpperCase();

      if (normalized === "DEVELOP") {
        setAdsEnabled(false);
        await persistAdsState(false);
        return "disabled";
      }

      if (normalized === "ADS") {
        setAdsEnabled(true);
        await persistAdsState(true);
        return "enabled";
      }

      return "invalid";
    },
    [persistAdsState],
  );

  const value = useMemo(
    () => ({
      adsEnabled,
      isInterstitialVisible,
      interstitialPlacement,
      maybeShowInterstitial,
      closeInterstitial,
      applyCoupon,
    }),
    [
      adsEnabled,
      isInterstitialVisible,
      interstitialPlacement,
      maybeShowInterstitial,
      closeInterstitial,
      applyCoupon,
    ],
  );

  return <AdsContext.Provider value={value}>{children}</AdsContext.Provider>;
}

export { AdsContext };
