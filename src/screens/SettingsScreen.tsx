import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { FixedAdBanner } from "@/features/ads/components";
import { useAds } from "@/features/ads/hooks";
import { Card, PrimaryButton } from "@/shared/components";
import { colors, spacing } from "@/shared/theme";
import { languages } from "@/shared/utils/languages";
import { useTranslation } from "react-i18next";
import i18n from "@/shared/i18n";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { adsEnabled, applyCoupon } = useAds();
  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language || "pt-BR",
  );
  const [couponCode, setCouponCode] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<string>("");

  const handleChangeLanguage = (lang: string) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleApplyCoupon = async () => {
    const result = await applyCoupon(couponCode);

    if (result === "disabled") {
      setCouponFeedback("Cupom DEVELOP aplicado: anuncios ocultos.");
    } else if (result === "enabled") {
      setCouponFeedback("Cupom ADS aplicado: anuncios ativados.");
    } else {
      setCouponFeedback("Cupom invalido. Use DEVELOP ou ADS.");
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>{t("settings.title")}</Text>
        <Text style={styles.text}>{t("settings.notification")}</Text>
        <View style={{ marginTop: spacing.lg }}>
          <Text style={styles.subtitle}>{t("settings.language")}</Text>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={handleChangeLanguage}
            style={styles.picker}
          >
            {languages.map((lang) => (
              <Picker.Item
                key={lang.code}
                label={lang.label}
                value={lang.code}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.couponSection}>
          <Text style={styles.subtitle}>Cupom de anuncios</Text>
          <Text style={styles.text}>
            Estado atual: {adsEnabled ? "anuncios ativos" : "anuncios ocultos"}
          </Text>
          <TextInput
            placeholder="Digite DEVELOP ou ADS"
            placeholderTextColor={colors.textMuted}
            value={couponCode}
            onChangeText={setCouponCode}
            autoCapitalize="characters"
            style={styles.input}
          />
          <PrimaryButton label="Aplicar cupom" onPress={handleApplyCoupon} />
          {couponFeedback ? (
            <Text style={styles.feedback}>{couponFeedback}</Text>
          ) : null}
        </View>
      </Card>
      <FixedAdBanner placement="settings_bottom" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    paddingBottom: 110,
  },
  title: {
    color: colors.text,
    fontWeight: "700",
    fontSize: 20,
    marginBottom: spacing.sm,
  },
  text: {
    color: colors.textMuted,
    lineHeight: 22,
  },
  subtitle: {
    color: colors.text,
    fontWeight: "600",
    fontSize: 16,
    marginBottom: spacing.sm,
  },
  picker: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 8,
    marginTop: spacing.sm,
  },
  couponSection: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  feedback: {
    color: colors.textMuted,
    lineHeight: 20,
  },
});
