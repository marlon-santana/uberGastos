export interface FixedCost {
  id: string;
  value: number;
  description: string;
  startDate: string;
  daysToPayoff: number;
  dailyAmount: number;
  endDate: string;
}

export interface FixedCostInput {
  value: number;
  description: string;
  startDate: string;
  daysToPayoff: number;
}
