import React, { useCallback, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { PrimaryButton } from '@/shared/components';
import { colors, radii, spacing } from '@/shared/theme';
import { FixedCostInput } from '@/features/fixedCosts/types/fixedCost';

interface AddFixedCostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: FixedCostInput) => Promise<void>;
}

const frequencies: Array<{ value: 'monthly' | 'weekly' | 'yearly'; label: string }> = [
  { value: 'monthly', label: 'Mensal' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'yearly', label: 'Anual' }
];

export function AddFixedCostModal({ visible, onClose, onSubmit }: AddFixedCostModalProps) {
  const [name, setName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [frequency, setFrequency] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  const [description, setDescription] = useState<string>('');

  const canSubmit = useMemo(() => name.trim().length > 0 && Number(amount) > 0, [name, amount]);

  const reset = useCallback(() => {
    setName('');
    setAmount('');
    setFrequency('monthly');
    setDescription('');
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) {
      return;
    }

    await onSubmit({
      name: name.trim(),
      amount: Number(amount),
      frequency,
      description
    });

    reset();
    onClose();
  }, [canSubmit, onSubmit, name, amount, frequency, description, reset, onClose]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Novo Custo Fixo</Text>

          <TextInput
            placeholder="Nome (ex: Seguro do carro)"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            keyboardType="decimal-pad"
            placeholder="Valor"
            placeholderTextColor={colors.textMuted}
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
          />

          <View style={styles.frequencyRow}>
            {frequencies.map((freq) => (
              <Pressable
                key={freq.value}
                style={[styles.frequencyButton, frequency === freq.value && styles.frequencyButtonActive]}
                onPress={() => setFrequency(freq.value)}
              >
                <Text style={styles.frequencyText}>{freq.label}</Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            placeholder="Descrição (opcional)"
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />

          <PrimaryButton label="Adicionar Custo Fixo" onPress={handleSubmit} />
          <Pressable onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end'
  },
  sheet: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    gap: spacing.sm
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.sm
  },
  input: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs
  },
  frequencyButton: {
    flex: 1,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    alignItems: 'center'
  },
  frequencyButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  frequencyText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 13
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm
  },
  cancelText: {
    color: colors.textMuted,
    fontWeight: '600'
  }
});
