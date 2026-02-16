import { DashboardCalculationService } from '@/features/dashboard/services/DashboardCalculationService';
import {
  NetProfitStrategy,
  TotalExpenseStrategy,
  TotalIncomeStrategy
} from '@/features/transactions/strategies';

export class DashboardMetricFactory {
  static createIncomeService(): DashboardCalculationService {
    return new DashboardCalculationService(new TotalIncomeStrategy());
  }

  static createExpenseService(): DashboardCalculationService {
    return new DashboardCalculationService(new TotalExpenseStrategy());
  }

  static createNetProfitService(): DashboardCalculationService {
    return new DashboardCalculationService(new NetProfitStrategy());
  }
}