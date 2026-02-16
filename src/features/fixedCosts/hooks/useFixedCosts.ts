import { useContext } from 'react';
import { FixedCostsContext } from '@/features/fixedCosts/context/FixedCostsContext';

export const useFixedCosts = () => {
  const context = useContext(FixedCostsContext);

  if (!context) {
    throw new Error('useFixedCosts must be used within FixedCostsProvider');
  }

  return context;
};
