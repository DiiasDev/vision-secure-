import { Box, Typography } from '@mui/material';
import KpiCards from './KpiCards';
import VendasChart from './VendasChart';
import RankingCorretores from './RankingCorretores';
import VendasPorCategoria from './VendasPorCategoria';
import VendasPorCategoriaCorretor from './VendasPorCategoriaCorretor';
import MetasMensais from './MetasMensais';

export default function GestaoFinanceira() {
  return (
    <Box 
      className="p-6 min-h-screen"
      sx={{ 
        backgroundColor: 'var(--bg-app)'
      }}
    >
      {/* Header */}
      <Box className="mb-8">
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'var(--text-primary)',
            fontWeight: 700,
            mb: 1
          }}
        >
          Gestão Financeira
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ color: 'var(--text-secondary)' }}
        >
          Visão geral do desempenho financeiro e vendas
        </Typography>
      </Box>

      {/* KPI Cards */}
      <KpiCards />

      {/* Main Charts Grid */}
      <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Box className="lg:col-span-2">
          <VendasChart />
        </Box>
        <Box>
          <VendasPorCategoria />
        </Box>
      </Box>

      {/* Vendas por Categoria por Corretor */}
      <Box className="mb-6">
        <VendasPorCategoriaCorretor />
      </Box>

      {/* Bottom Grid */}
      <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RankingCorretores />
        <MetasMensais />
      </Box>
    </Box>
  );
}
