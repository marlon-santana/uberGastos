import { TFunction } from 'i18next';
import { WelcomeFactory } from '@/features/welcome/factory/WelcomeFactory';
import { WelcomeBenefit } from '@/features/welcome/types/welcome';

export class WelcomeService {
  getBenefits(t: TFunction): WelcomeBenefit[] {
    return WelcomeFactory.createBenefits(t);
  }
}