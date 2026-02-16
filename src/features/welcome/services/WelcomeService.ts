import { WelcomeFactory } from '@/features/welcome/factory/WelcomeFactory';
import { WelcomeBenefit } from '@/features/welcome/types/welcome';

export class WelcomeService {
  getBenefits(): WelcomeBenefit[] {
    return WelcomeFactory.createBenefits();
  }
}