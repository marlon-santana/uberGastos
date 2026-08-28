import { useContext } from 'react';
import { CategoriesContext } from '@/features/transactions/context/CategoriesContext';

export const useCategories = () => {
  const context = useContext(CategoriesContext);

  if (!context) {
    throw new Error('useCategories must be used within CategoriesProvider');
  }

  return context;
};
