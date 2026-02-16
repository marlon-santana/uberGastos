import { FixedCost, FixedCostInput } from '@/features/fixedCosts/types/fixedCost';

export class FixedCostFactory {
  static create(data: FixedCostInput): FixedCost {
    return {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      name: data.name.trim(),
      amount: data.amount,
      frequency: data.frequency,
      description: data.description?.trim() || undefined
    };
  }
}
