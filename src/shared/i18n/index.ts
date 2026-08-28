import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ptBR from "./locales/pt-BR.json";
import ptPT from "./locales/pt-PT.json";
import es from "./locales/es.json";
import zh from "./locales/zh.json";
import ko from "./locales/ko.json";
import it from "./locales/it.json";

const resources = {
  en: { translation: en },
  "pt-BR": { translation: ptBR },
  "pt-PT": { translation: ptPT },
  es: { translation: es },
  zh: { translation: zh },
  ko: { translation: ko },
  it: { translation: it },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "pt-BR",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
