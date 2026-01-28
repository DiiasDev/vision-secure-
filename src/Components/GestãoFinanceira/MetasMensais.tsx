import MetasMensaisGrafico from './graficos/MetasMensaisGrafico';

const metasData = [
  { mes: 'Janeiro', meta: 40000, realizado: 45000, status: 'atingida' as const },
  { mes: 'Fevereiro', meta: 45000, realizado: 52000, status: 'atingida' as const },
  { mes: 'Março', meta: 45000, realizado: 48000, status: 'atingida' as const },
  { mes: 'Abril', meta: 50000, realizado: 61000, status: 'atingida' as const },
  { mes: 'Maio', meta: 50000, realizado: 55000, status: 'atingida' as const },
  { mes: 'Junho', meta: 55000, realizado: 67000, status: 'atingida' as const },
  { mes: 'Julho', meta: 55000, realizado: 58000, status: 'atingida' as const },
  { mes: 'Agosto', meta: 60000, realizado: 62000, status: 'atingida' as const },
  { mes: 'Setembro', meta: 60000, realizado: 71000, status: 'atingida' as const },
  { mes: 'Outubro', meta: 65000, realizado: 68000, status: 'atingida' as const },
  { mes: 'Novembro', meta: 65000, realizado: 75000, status: 'atingida' as const },
  { mes: 'Dezembro', meta: 70000, realizado: 48500, status: 'em-andamento' as const }
];

export default function MetasMensais() {
  return <MetasMensaisGrafico data={metasData} />;
}
