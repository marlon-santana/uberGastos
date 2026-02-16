export interface FixedCost {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'weekly' | 'yearly';
  description?: string;
}

export interface FixedCostInput {
  name: string;
  amount: number;
  frequency: 'monthly' | 'weekly' | 'yearly';
  description?: string;
}
