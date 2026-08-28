import { TFunction } from "i18next";

export class WelcomeMessageStrategy {
  getTitle(t: TFunction): string {
    return t("welcome.title");
  }
}
