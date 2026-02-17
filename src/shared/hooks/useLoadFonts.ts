import { useEffect } from "react";
import * as Font from "expo-font";
import { Feather } from "@expo/vector-icons";

export function useLoadFonts(callback?: () => void) {
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          ...Feather.font,
        });
        if (callback) callback();
      } catch (error) {
        console.error("Erro ao carregar fontes:", error);
        if (callback) callback(); // Garante que o app não fique preso
      }
    }
    
    loadFonts();
  }, [callback]);
}
