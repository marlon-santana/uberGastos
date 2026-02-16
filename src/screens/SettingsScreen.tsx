import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/shared/components';
import { colors, spacing } from '@/shared/theme';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.title}>Configuracoes</Text>
        <Text style={styles.text}>Preferencias de notificacao e personalizacao serao adicionadas aqui.</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md
  },
  title: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 20,
    marginBottom: spacing.sm
  },
  text: {
    color: colors.textMuted,
    lineHeight: 22
  }
});