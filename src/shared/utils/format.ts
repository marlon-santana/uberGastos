export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (value: string): string => {
  return new Date(value).toLocaleDateString('pt-BR');
};

export const toISODate = (date: Date = new Date()): string => {
  return date.toISOString().split('T')[0];
};