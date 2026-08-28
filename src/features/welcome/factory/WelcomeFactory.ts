import { TFunction } from 'i18next';
import { WelcomeBenefit } from '@/features/welcome/types/welcome';

export class WelcomeFactory {
  static createBenefits(t: TFunction): WelcomeBenefit[] {
    return [
      { id: '1', emoji: '✅', label: t('welcome.benefits.rides') },
      { id: '2', emoji: '📊', label: t('welcome.benefits.reports') },
      { id: '3', emoji: '🛠️', label: t('welcome.benefits.settings') },
      { id: '4', emoji: '💡', label: t('welcome.benefits.tips') },
    ];
  }
}
