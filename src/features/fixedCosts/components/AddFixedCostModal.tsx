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
import { toISODate } from '@/shared/utils/format';
import { FixedCostInput } from '@/features/fixedCosts/types';

interface AddFixedCostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: FixedCostInput) => Promise<void>;
}

export function AddFixedCostModal({ visible, onClose, onSubmit }: AddFixedCostModalProps) {
  const [value, setValue] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<string>(toISODate());
  const [daysToPayoff, setDaysToPayoff] = useState<string>('');

  const canSubmit = useMemo(() => {
    return Number(value) > 0 && 
           description.trim().length > 0 && 
           Number(daysToPayoff) > 0;
  }, [value, description, daysToPayoff]);

  const reset = useCallback(() => {
    setValue('');
    setDescription('');
    setStartDate(toISODate());
    setDaysToPayoff('');
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) {
      return;
    }

    await onSubmit({
      value: Number(value),
      description: description.trim(),
      startDate,
      daysToPayoff: Number(daysToPayoff)
    });

    reset();
    onClose();
  }, [canSubmit, onSubmit, value, description, startDate, daysToPayoff, reset, onClose]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Novo Custo Fixo</Text>

          <TextInput
            keyboardType="decimal-pad"
            placeholder="Valor total (ex: 900)"
            placeholderTextColor={colors.textMuted}
            value={value}
            onChangeText={setValue}
            style={styles.input}
          />
          <TextInput
            placeholder="Descrição (ex: Aluguel de carro)"
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />
          <TextInput
            placeholder="Data inicial (YYYY-MM-DD)"
            placeholderTextColor={colors.textMuted}
            value={startDate}
            onChangeText={setStartDate}
            style={styles.input}
          />
          <TextInput
            keyboardType="number-pad"
            placeholder="Dias para pagar (ex: 10)"
            placeholderTextColor={colors.textMuted}
            value={daysToPayoff}
            onChangeText={setDaysToPayoff}
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
  cancelButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm
  },
  cancelText: {
    color: colors.textMuted,
    fontWeight: '600'
  }
});
