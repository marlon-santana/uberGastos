import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { FixedCostsList, AddFixedCostModal } from '@/features/fixedCosts/components';
import { useFixedCosts } from '@/features/fixedCosts/hooks/useFixedCosts';
import { FloatingActionButton } from '@/shared/components';
import { colors, spacing } from '@/shared/theme';

export default function FixedCostsScreen() {
  const { fixedCosts, loading, addFixedCost, removeFixedCost } = useFixedCosts();
  const [modalVisible, setModalVisible] = useState(false);

  const handleRemove = useCallback(async (id: string) => {
    await removeFixedCost(id);
  }, [removeFixedCost]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FixedCostsList fixedCosts={fixedCosts} onRemove={handleRemove} />
      <FloatingActionButton onPress={() => setModalVisible(true)} />
      <AddFixedCostModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={addFixedCost}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
