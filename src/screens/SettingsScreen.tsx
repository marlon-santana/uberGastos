import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Card } from "@/shared/components";
import { colors, spacing } from "@/shared/theme";
import { languages } from "@/shared/utils/languages";
import { useTranslation } from "react-i18next";
import i18n from "@/shared/i18n";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(
    i18n.language || "pt-BR",
  );
  const handleChangeLanguage = (lang: string) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
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
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
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
});
