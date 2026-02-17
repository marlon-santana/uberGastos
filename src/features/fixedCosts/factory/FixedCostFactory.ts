import { FixedCost, FixedCostInput } from "@/features/fixedCosts/types";

export class FixedCostFactory {
  static create(input: FixedCostInput): FixedCost {
    const dailyAmount = input.value / input.daysToPayoff;
    const startDate = new Date(input.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + input.daysToPayoff);

    return {
      id: Date.now().toString(),
      value: input.value,
      description: input.description,
      startDate: input.startDate,
      daysToPayoff: input.daysToPayoff,
      dailyAmount,
      endDate: endDate.toISOString().split("T")[0],
      payments: input.payments ?? [],
    };
  }
}
