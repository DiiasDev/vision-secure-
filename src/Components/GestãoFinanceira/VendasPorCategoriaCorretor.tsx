import VendasPorCategoriaCorretorGrafico from './graficos/VendasPorCategoriaCorretorGrafico';

const vendasPorCategoriaData = [
  { 
    corretor: 'Carlos', 
    auto: 52000, 
    vida: 38000, 
    residencial: 28000, 
    empresarial: 20000, 
    outros: 7000 
  },
  { 
    corretor: 'Ana', 
    auto: 48000, 
    vida: 35000, 
    residencial: 25000, 
    empresarial: 18000, 
    outros: 6000 
  },
  { 
    corretor: 'Roberto', 
    auto: 45000, 
    vida: 32000, 
    residencial: 22000, 
    empresarial: 15000, 
    outros: 4000 
  },
  { 
    corretor: 'Mariana', 
    auto: 38000, 
    vida: 28000, 
    residencial: 18000, 
    empresarial: 8000, 
    outros: 3000 
  },
  { 
    corretor: 'Pedro', 
    auto: 35000, 
    vida: 25000, 
    residencial: 16000, 
    empresarial: 8000, 
    outros: 3000 
  },
];

export default function VendasPorCategoriaCorretor() {
  return <VendasPorCategoriaCorretorGrafico data={vendasPorCategoriaData} />;
}
