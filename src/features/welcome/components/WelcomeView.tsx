import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { WelcomeFactory } from '@/features/welcome/factory/WelcomeFactory';
import { WelcomeMessageStrategy } from '@/features/welcome/strategies/WelcomeMessageStrategy';
import { PrimaryButton } from '@/shared/components';
import { colors, spacing } from '@/shared/theme';

interface WelcomeViewProps {
  onStart: () => void;
}

export function WelcomeView({ onStart }: WelcomeViewProps) {
  const strategy = useMemo(() => new WelcomeMessageStrategy(), []);
  const benefits = useMemo(() => WelcomeFactory.createBenefits(), []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strategy.getTitle()}</Text>

      <FlatList
        data={benefits}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.benefitsContainer}
        renderItem={({ item }) => (
          <View style={styles.benefitRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.benefit}>{item.label}</Text>
          </View>
        )}
      />

      <PrimaryButton label="Comecar Agora" onPress={onStart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'space-between'
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 34,
    marginTop: spacing.lg
  },
  benefitsContainer: {
    paddingVertical: spacing.lg,
    gap: spacing.sm
  },
  benefitRow: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  bullet: {
    color: colors.primary,
    fontSize: 18,
    lineHeight: 20,
    marginTop: 2
  },
  benefit: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    lineHeight: 22
  }
});