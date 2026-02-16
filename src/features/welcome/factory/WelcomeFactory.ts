import { WelcomeBenefit } from '@/features/welcome/types/welcome';

export class WelcomeFactory {
  static createBenefits(): WelcomeBenefit[] {
    return [
      { id: '1', label: 'Controle total de ganhos Uber e 99' },
      { id: '2', label: 'Registro rapido de despesas' },
      { id: '3', label: 'Visualizacao clara do lucro liquido' },
      { id: '4', label: 'Relatorios semanais e mensais' },
      { id: '5', label: 'Graficos intuitivos' },
      { id: '6', label: 'Organizacao por categorias' },
      { id: '7', label: 'Melhor planejamento financeiro' },
      { id: '8', label: 'Aumento da lucratividade' }
    ];
  }
}