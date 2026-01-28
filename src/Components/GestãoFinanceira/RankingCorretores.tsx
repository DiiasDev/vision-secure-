import RankingCorretoresGrafico from './graficos/RankingCorretoresGrafico';

const corretoresData = [
  { id: 1, nome: 'Carlos Silva', vendas: 145000, meta: 120000, crescimento: 18.5, posicao: 1, avatar: 'CS' },
  { id: 2, nome: 'Ana Santos', vendas: 132000, meta: 110000, crescimento: 15.2, posicao: 2, avatar: 'AS' },
  { id: 3, nome: 'Roberto Lima', vendas: 118000, meta: 100000, crescimento: 12.8, posicao: 3, avatar: 'RL' },
  { id: 4, nome: 'Mariana Costa', vendas: 95000, meta: 90000, crescimento: 8.4, posicao: 4, avatar: 'MC' },
  { id: 5, nome: 'Pedro Oliveira', vendas: 87000, meta: 90000, crescimento: -3.2, posicao: 5, avatar: 'PO' },
  { id: 6, nome: 'Julia Ferreira', vendas: 78000, meta: 80000, crescimento: 5.7, posicao: 6, avatar: 'JF' },
  { id: 7, nome: 'Lucas Almeida', vendas: 72000, meta: 75000, crescimento: -1.5, posicao: 7, avatar: 'LA' },
  { id: 8, nome: 'Beatriz Souza', vendas: 68000, meta: 70000, crescimento: 2.1, posicao: 8, avatar: 'BS' }
];

export default function RankingCorretores() {
  return <RankingCorretoresGrafico data={corretoresData} />;
}
