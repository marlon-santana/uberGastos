import { useEffect } from "react";
import { useFonts } from "expo-font";
import { Feather } from "@expo/vector-icons";

export function useLoadFonts() {
  const [fontsLoaded, fontError] = useFonts({
    ...Feather.font,
  });

  useEffect(() => {
    if (fontError) {
      console.error("Erro ao carregar fontes de icone:", fontError);
    }
  }, [fontError]);

  return fontsLoaded;
}
