import VendasPorCategoriaGrafico from './graficos/VendasPorCategoriaGrafico';

const categoriaData = [
  { name: 'Auto', value: 185000, color: '#2563eb' },
  { name: 'Vida', value: 125000, color: '#16a34a' },
  { name: 'Residencial', value: 95000, color: '#8b5cf6' },
  { name: 'Empresarial', value: 65000, color: '#d97706' },
  { name: 'Outros', value: 17500, color: '#64748b' }
];

export default function VendasPorCategoria() {
  return <VendasPorCategoriaGrafico data={categoriaData} />;
}
