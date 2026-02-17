export interface PaymentEntry {
  date: string;
  amount: number;
}

export interface FixedCost {
  id: string;
  value: number;
  description: string;
  startDate: string;
  daysToPayoff: number;
  dailyAmount: number;
  endDate: string;
  payments: PaymentEntry[];
}

export interface FixedCostInput {
  value: number;
  description: string;
  startDate: string;
  daysToPayoff: number;
  payments?: PaymentEntry[];
}
