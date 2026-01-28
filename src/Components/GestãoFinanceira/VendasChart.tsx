import EvolucaoVendasGrafico from './graficos/EvolucaoVendasGrafico';

// Dados mockados - devem vir da API
const vendasData = [
  { mes: 'Jan', vendas: 45000, meta: 40000, ano_anterior: 38000 },
  { mes: 'Fev', vendas: 52000, meta: 45000, ano_anterior: 42000 },
  { mes: 'Mar', vendas: 48000, meta: 45000, ano_anterior: 45000 },
  { mes: 'Abr', vendas: 61000, meta: 50000, ano_anterior: 48000 },
  { mes: 'Mai', vendas: 55000, meta: 50000, ano_anterior: 51000 },
  { mes: 'Jun', vendas: 67000, meta: 55000, ano_anterior: 54000 },
  { mes: 'Jul', vendas: 58000, meta: 55000, ano_anterior: 56000 },
  { mes: 'Ago', vendas: 62000, meta: 60000, ano_anterior: 59000 },
  { mes: 'Set', vendas: 71000, meta: 60000, ano_anterior: 62000 },
  { mes: 'Out', vendas: 68000, meta: 65000, ano_anterior: 65000 },
  { mes: 'Nov', vendas: 75000, meta: 65000, ano_anterior: 67000 },
  { mes: 'Dez', vendas: 82000, meta: 70000, ano_anterior: 70000 }
];

export default function VendasChart() {
  return <EvolucaoVendasGrafico data={vendasData} />;
}
