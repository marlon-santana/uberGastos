import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Feather } from "@expo/vector-icons";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";

export function useLoadFonts() {
  const [fontsLoaded, fontError] = useFonts({
    ...Feather.font,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  useEffect(() => {
    if (fontError) {
      console.error("Erro ao carregar fontes de icone:", fontError);
    }
  }, [fontError]);

  return fontsLoaded || !!fontError;
}
