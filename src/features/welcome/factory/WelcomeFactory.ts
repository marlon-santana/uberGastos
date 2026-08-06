import { WelcomeBenefit } from '@/features/welcome/types/welcome';

export class WelcomeFactory {
  static createBenefits(): WelcomeBenefit[] {
    return [
      { id: '1', emoji: '✅', label: 'Cadastro de corridas' },
      { id: '2', emoji: '📊', label: 'Relatórios financeiros' },
      { id: '3', emoji: '🛠️', label: 'Configurações' },
      { id: '4', emoji: '💡', label: 'Dicas de uso' }
    ];
  }
}
