import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Download,
  TrendingUp,
  TableChart,
  BarChart,
  Assessment,
  Visibility,
  CalendarMonth,
  Category,
  AttachMoney,
  InfoOutlined
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import DateRangeFilter from './DateRangeFilter';
import CorretorFilter from './CorretorFilter';

import type { ReactElement } from 'react';

interface Relatorio {
  id: number;
  tipo: string;
  nome: string;
  descricao: string;
  ultimaAtualizacao: string;
  formato: string[];
  icon: ReactElement;
}

const relatoriosDisponiveis: Relatorio[] = [
  {
    id: 1,
    tipo: 'vendas',
    nome: 'Relatório de Vendas',
    descricao: 'Análise completa de vendas por período, corretor e categoria',
    ultimaAtualizacao: '26/01/2026',
    formato: ['PDF', 'Excel', 'CSV'],
    icon: <BarChart sx={{ fontSize: 40, color: 'var(--color-primary)' }} />
  },
  {
    id: 2,
    tipo: 'comissoes',
    nome: 'Relatório de Comissões',
    descricao: 'Comissões pagas, pendentes e atrasadas por corretor',
    ultimaAtualizacao: '26/01/2026',
    formato: ['PDF', 'Excel'],
    icon: <AttachMoney sx={{ fontSize: 40, color: 'var(--color-success)' }} />
  },
  {
    id: 3,
    tipo: 'performance',
    nome: 'Performance de Corretores',
    descricao: 'Ranking e análise de desempenho individual e comparativo',
    ultimaAtualizacao: '25/01/2026',
    formato: ['PDF', 'Excel'],
    icon: <Assessment sx={{ fontSize: 40, color: 'var(--color-warning)' }} />
  },
  {
    id: 4,
    tipo: 'categorias',
    nome: 'Vendas por Categoria',
    descricao: 'Distribuição e evolução de vendas por tipo de seguro',
    ultimaAtualizacao: '26/01/2026',
    formato: ['PDF', 'Excel', 'CSV'],
    icon: <Category sx={{ fontSize: 40, color: 'var(--color-info)' }} />
  },
  {
    id: 5,
    tipo: 'financeiro',
    nome: 'Relatório Financeiro Consolidado',
    descricao: 'Visão geral de receitas, despesas e lucros',
    ultimaAtualizacao: '26/01/2026',
    formato: ['PDF', 'Excel'],
    icon: <TableChart sx={{ fontSize: 40, color: 'var(--color-danger)' }} />
  },
  {
    id: 6,
    tipo: 'metas',
    nome: 'Acompanhamento de Metas',
    descricao: 'Progresso de metas individuais e da equipe',
    ultimaAtualizacao: '24/01/2026',
    formato: ['PDF', 'Excel'],
    icon: <TrendingUp sx={{ fontSize: 40, color: 'var(--color-primary)' }} />
  }
];

// Dados fictícios para preview
const dadosVendasMes = [
  { mes: 'Jul', valor: 85000 },
  { mes: 'Ago', valor: 92000 },
  { mes: 'Set', valor: 78000 },
  { mes: 'Out', valor: 110000 },
  { mes: 'Nov', valor: 125000 },
  { mes: 'Dez', valor: 105000 },
  { mes: 'Jan', valor: 135000 }
];

const dadosCategorias = [
  { nome: 'Auto', valor: 450000, cor: '#3b82f6' },
  { nome: 'Vida', valor: 320000, cor: '#10b981' },
  { nome: 'Residencial', valor: 180000, cor: '#f59e0b' },
  { nome: 'Empresarial', valor: 240000, cor: '#8b5cf6' },
  { nome: 'Saúde', valor: 150000, cor: '#ef4444' }
];

const topCorretoresData = [
  { nome: 'Carlos Silva', vendas: 45, valor: 320000 },
  { nome: 'Ana Santos', vendas: 38, valor: 285000 },
  { nome: 'Roberto Lima', vendas: 35, valor: 260000 },
  { nome: 'Mariana Costa', vendas: 32, valor: 245000 },
  { nome: 'Pedro Oliveira', vendas: 28, valor: 210000 }
];

export default function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState('todos');
  const [formato, setFormato] = useState('pdf');
  const [openPreview, setOpenPreview] = useState(false);
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<Relatorio | null>(null);

  const handleGerarRelatorio = (relatorio: Relatorio) => {
    console.log(`Gerando relatório: ${relatorio.nome} no formato ${formato}`);
    // Aqui virá a lógica de geração do relatório
    alert(`Gerando ${relatorio.nome} em formato ${formato.toUpperCase()}...`);
  };

  const handleVisualizarPreview = (relatorio: Relatorio) => {
    setRelatorioSelecionado(relatorio);
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    setRelatorioSelecionado(null);
  };

  const renderPreviewContent = () => {
    if (!relatorioSelecionado) return null;

    switch (relatorioSelecionado.tipo) {
      case 'vendas':
        return (
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                backgroundColor: 'var(--bg-hover)',
                borderRadius: 2,
                p: 3,
                mb: 3,
                border: '1px solid var(--border-default)'
              }}
            >
              <Box className="flex items-center gap-2 mb-3">
                <BarChart sx={{ fontSize: 32, color: 'var(--color-primary)' }} />
                <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                  Relatório de Vendas
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                Análise detalhada do desempenho comercial da corretora
              </Typography>
            </Box>

            <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 2 }}>
              📊 Conteúdo do Relatório:
            </Typography>
            <Box sx={{ backgroundColor: 'var(--bg-hover)', borderRadius: 2, p: 2, mb: 3 }}>
              <ul style={{ color: 'var(--text-primary)', paddingLeft: '24px', margin: 0, lineHeight: 2 }}>
                <li><strong>Evolução de vendas mensais</strong> - Gráficos de tendência</li>
                <li><strong>Ranking de corretores</strong> - Top performers do período</li>
                <li><strong>Distribuição por categoria</strong> - Auto, Vida, Residencial, etc.</li>
                <li><strong>Análise comparativa</strong> - Períodos anteriores</li>
                <li><strong>Metas vs Realizado</strong> - Taxa de atingimento</li>
              </ul>
            </Box>

            <Box
              sx={{
                backgroundColor: 'var(--color-primary)',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
                p: 3,
                borderRadius: 2,
                color: 'white'
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 1 }}>
                TOTAL DE VENDAS NO PERÍODO
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                R$ 1.340.000,00
              </Typography>
            </Box>
          </Box>
        );
      case 'comissoes':
        return (
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                backgroundColor: 'var(--bg-hover)',
                borderRadius: 2,
                p: 3,
                mb: 3,
                border: '1px solid var(--border-default)'
              }}
            >
              <Box className="flex items-center gap-2 mb-3">
                <AttachMoney sx={{ fontSize: 32, color: 'var(--color-success)' }} />
                <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                  Relatório de Comissões
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                Controle completo de comissões de corretores
              </Typography>
            </Box>

            <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 2 }}>
              💰 Conteúdo do Relatório:
            </Typography>
            <Box sx={{ backgroundColor: 'var(--bg-hover)', borderRadius: 2, p: 2, mb: 3 }}>
              <ul style={{ color: 'var(--text-primary)', paddingLeft: '24px', margin: 0, lineHeight: 2 }}>
                <li><strong>Comissões pagas</strong> - Detalhamento de pagamentos realizados</li>
                <li><strong>Comissões pendentes</strong> - A pagar no período</li>
                <li><strong>Comissões atrasadas</strong> - Identificação e valores</li>
                <li><strong>Detalhamento por corretor</strong> - Análise individual</li>
                <li><strong>Total consolidado</strong> - Visão geral financeira</li>
              </ul>
            </Box>

            <Box
              sx={{
                backgroundColor: 'var(--color-success)',
                background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)',
                p: 3,
                borderRadius: 2,
                color: 'white'
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 1 }}>
                TOTAL EM COMISSÕES
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                R$ 134.000,00
              </Typography>
            </Box>
          </Box>
        );
      case 'performance':
        return (
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                backgroundColor: 'var(--bg-hover)',
                borderRadius: 2,
                p: 3,
                mb: 3,
                border: '1px solid var(--border-default)'
              }}
            >
              <Box className="flex items-center gap-2 mb-3">
                <Assessment sx={{ fontSize: 32, color: 'var(--color-warning)' }} />
                <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                  Performance de Corretores
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                Análise detalhada de desempenho individual e da equipe
              </Typography>
            </Box>

            <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 2 }}>
              🏆 Conteúdo do Relatório:
            </Typography>
            <Box sx={{ backgroundColor: 'var(--bg-hover)', borderRadius: 2, p: 2, mb: 3 }}>
              <ul style={{ color: 'var(--text-primary)', paddingLeft: '24px', margin: 0, lineHeight: 2 }}>
                <li><strong>Ranking geral</strong> - Classificação de todos os corretores</li>
                <li><strong>Número de vendas</strong> - Quantidade por corretor</li>
                <li><strong>Ticket médio individual</strong> - Análise de performance</li>
                <li><strong>Taxa de conversão</strong> - Eficiência de vendas</li>
                <li><strong>Evolução mensal</strong> - Tendências e crescimento</li>
              </ul>
            </Box>

            <Box
              sx={{
                backgroundColor: 'var(--color-warning)',
                background: 'linear-gradient(135deg, var(--color-warning) 0%, #d97706 100%)',
                p: 3,
                borderRadius: 2,
                color: 'white'
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 1 }}>
                MELHOR CORRETOR DO PERÍODO
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Carlos Silva
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                45 vendas realizadas
              </Typography>
            </Box>
          </Box>
        );
      case 'categorias':
        return (
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                backgroundColor: 'var(--bg-hover)',
                borderRadius: 2,
                p: 3,
                mb: 3,
                border: '1px solid var(--border-default)'
              }}
            >
              <Box className="flex items-center gap-2 mb-3">
                <Category sx={{ fontSize: 32, color: 'var(--color-info)' }} />
                <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                  Vendas por Categoria
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                Distribuição e evolução de vendas por tipo de seguro
              </Typography>
            </Box>

            <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 2 }}>
              📊 Conteúdo do Relatório:
            </Typography>
            <Box sx={{ backgroundColor: 'var(--bg-hover)', borderRadius: 2, p: 2, mb: 3 }}>
              <ul style={{ color: 'var(--text-primary)', paddingLeft: '24px', margin: 0, lineHeight: 2 }}>
                <li><strong>Distribuição percentual</strong> - Participação de cada categoria</li>
                <li><strong>Evolução mensal</strong> - Crescimento por tipo</li>
                <li><strong>Comparativo</strong> - Análise entre categorias</li>
                <li><strong>Tendências</strong> - Projeções e insights</li>
                <li><strong>Top produtos</strong> - Mais vendidos por categoria</li>
              </ul>
            </Box>

            <Box
              sx={{
                backgroundColor: 'var(--color-info)',
                background: 'linear-gradient(135deg, var(--color-info) 0%, #0284c7 100%)',
                p: 3,
                borderRadius: 2,
                color: 'white'
              }}
            >
              <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 1 }}>
                CATEGORIA COM MAIOR VOLUME
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Seguros Auto
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                R$ 450.000,00 (33.6%)
              </Typography>
            </Box>
          </Box>
        );
      case 'financeiro':
        return (
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                backgroundColor: 'var(--bg-hover)',
                borderRadius: 2,
                p: 3,
                mb: 3,
                border: '1px solid var(--border-default)'
              }}
            >
              <Box className="flex items-center gap-2 mb-3">
                <TableChart sx={{ fontSize: 32, color: 'var(--color-danger)' }} />
                <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                  Relatório Financeiro Consolidado
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                Visão completa da saúde financeira da empresa
              </Typography>
            </Box>

            <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 2 }}>
              💵 Conteúdo do Relatório:
            </Typography>
            <Box sx={{ backgroundColor: 'var(--bg-hover)', borderRadius: 2, p: 2, mb: 3 }}>
              <ul style={{ color: 'var(--text-primary)', paddingLeft: '24px', margin: 0, lineHeight: 2 }}>
                <li><strong>Receitas totais</strong> - Faturamento do período</li>
                <li><strong>Despesas operacionais</strong> - Custos e gastos</li>
                <li><strong>Lucro líquido</strong> - Resultado final</li>
                <li><strong>Margem de lucro</strong> - Indicadores percentuais</li>
                <li><strong>Fluxo de caixa</strong> - Movimentações financeiras</li>
              </ul>
            </Box>

            <Box className="grid grid-cols-2 gap-3">
              <Box
                sx={{
                  backgroundColor: 'var(--color-success)',
                  background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)',
                  p: 3,
                  borderRadius: 2,
                  color: 'white'
                }}
              >
                <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 1 }}>
                  RECEITA TOTAL
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  R$ 1.340.000
                </Typography>
              </Box>
              <Box
                sx={{
                  backgroundColor: 'var(--color-danger)',
                  background: 'linear-gradient(135deg, var(--color-danger) 0%, #dc2626 100%)',
                  p: 3,
                  borderRadius: 2,
                  color: 'white'
                }}
              >
                <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 1 }}>
                  LUCRO LÍQUIDO
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  R$ 268.000
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      case 'metas':
        return (
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                backgroundColor: 'var(--bg-hover)',
                borderRadius: 2,
                p: 3,
                mb: 3,
                border: '1px solid var(--border-default)'
              }}
            >
              <Box className="flex items-center gap-2 mb-3">
                <TrendingUp sx={{ fontSize: 32, color: 'var(--color-primary)' }} />
                <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                  Acompanhamento de Metas
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
                Monitoramento de objetivos e resultados da equipe
              </Typography>
            </Box>

            <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 2 }}>
              🎯 Conteúdo do Relatório:
            </Typography>
            <Box sx={{ backgroundColor: 'var(--bg-hover)', borderRadius: 2, p: 2, mb: 3 }}>
              <ul style={{ color: 'var(--text-primary)', paddingLeft: '24px', margin: 0, lineHeight: 2 }}>
                <li><strong>Metas estabelecidas</strong> - Objetivos por corretor</li>
                <li><strong>Percentual de atingimento</strong> - Progressão atual</li>
                <li><strong>Comparativo</strong> - Meta vs realizado</li>
                <li><strong>Projeções</strong> - Estimativas para final do período</li>
                <li><strong>Status detalhado</strong> - Atingida/pendente/crítica</li>
              </ul>
            </Box>

            <Box
              sx={{
                backgroundColor: 'var(--color-primary)',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
                p: 3,
                borderRadius: 2,
                color: 'white'
              }}
            >
              <Box className="flex items-center justify-between mb-2">
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.9, display: 'block', mb: 1 }}>
                    TAXA DE ATINGIMENTO MÉDIO
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    87%
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 64, opacity: 0.3 }} />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                12 de 15 metas atingidas
              </Typography>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  const relatoriosFiltrados = tipoRelatorio === 'todos'
    ? relatoriosDisponiveis
    : relatoriosDisponiveis.filter(r => r.tipo === tipoRelatorio);

  return (
    <Box
      className="p-6 min-h-screen"
      sx={{ backgroundColor: 'var(--bg-app)' }}
    >
      {/* Header */}
      <Box className="mb-6">
        <Typography
          variant="h4"
          sx={{
            color: 'var(--text-primary)',
            fontWeight: 700,
            mb: 1
          }}
        >
          Relatórios Gerenciais
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'var(--text-secondary)' }}
        >
          Gere relatórios detalhados e análises de desempenho
        </Typography>
      </Box>

      {/* Cards de Estatísticas Rápidas */}
      <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <Box>
          <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <CardContent>
              <Box className="flex items-center justify-between mb-2">
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                  Relatórios Gerados
                </Typography>
                <Assessment sx={{ color: 'var(--color-primary)', fontSize: 24 }} />
              </Box>
              <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                248
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                Este mês
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <CardContent>
              <Box className="flex items-center justify-between mb-2">
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                  Downloads
                </Typography>
                <Download sx={{ color: 'var(--color-success)', fontSize: 24 }} />
              </Box>
              <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                1.234
              </Typography>
              <Box className="flex items-center gap-1 mt-1">
                <TrendingUp sx={{ color: 'var(--color-success)', fontSize: 16 }} />
                <Typography variant="caption" sx={{ color: 'var(--color-success)' }}>
                  +12% vs mês anterior
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <CardContent>
              <Box className="flex items-center justify-between mb-2">
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                  Agendados
                </Typography>
                <CalendarMonth sx={{ color: 'var(--color-warning)', fontSize: 24 }} />
              </Box>
              <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                18
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                Próximos 7 dias
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <CardContent>
              <Box className="flex items-center justify-between mb-2">
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                  Mais Usado
                </Typography>
                <BarChart sx={{ color: 'var(--color-info)', fontSize: 24 }} />
              </Box>
              <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                Vendas
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                42% dos relatórios
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Filtros e Ações */}
      <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)', mb: 4 }}>
        <CardContent>
          <Box className="flex items-center justify-between flex-wrap gap-3">
            <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              Gerar Relatório
            </Typography>
            
            <Box className="flex items-center gap-3 flex-wrap">
              <TextField
                select
                size="small"
                value={tipoRelatorio}
                onChange={(e) => setTipoRelatorio(e.target.value)}
                sx={{
                  minWidth: 180,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--input-bg)',
                    '& fieldset': { borderColor: 'var(--input-border)' },
                  },
                  '& .MuiInputBase-input': { color: 'var(--text-primary)' }
                }}
              >
                <MenuItem value="todos">Todos os Tipos</MenuItem>
                <MenuItem value="vendas">Vendas</MenuItem>
                <MenuItem value="comissoes">Comissões</MenuItem>
                <MenuItem value="performance">Performance</MenuItem>
                <MenuItem value="categorias">Categorias</MenuItem>
                <MenuItem value="financeiro">Financeiro</MenuItem>
                <MenuItem value="metas">Metas</MenuItem>
              </TextField>

              <TextField
                select
                size="small"
                value={formato}
                onChange={(e) => setFormato(e.target.value)}
                sx={{
                  minWidth: 120,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--input-bg)',
                    '& fieldset': { borderColor: 'var(--input-border)' },
                  },
                  '& .MuiInputBase-input': { color: 'var(--text-primary)' }
                }}
              >
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
              </TextField>

              <DateRangeFilter />
              <CorretorFilter />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Grid de Relatórios Disponíveis */}
      <Box className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        {relatoriosFiltrados.map((relatorio) => (
          <Box key={relatorio.id}>
            <Card
              sx={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'var(--color-primary)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent>
                <Box className="flex flex-col h-full">
                  <Box className="flex items-start justify-between mb-3">
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        backgroundColor: 'var(--bg-hover)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {relatorio.icon}
                    </Box>
                    <Chip
                      label="Disponível"
                      size="small"
                      sx={{
                        backgroundColor: 'var(--color-success-bg)',
                        color: 'var(--color-success)',
                        fontWeight: 600,
                        fontSize: '0.7rem'
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      color: 'var(--text-primary)',
                      fontWeight: 600,
                      mb: 1
                    }}
                  >
                    {relatorio.nome}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'var(--text-secondary)',
                      mb: 2,
                      flexGrow: 1
                    }}
                  >
                    {relatorio.descricao}
                  </Typography>

                  <Box className="mb-3">
                    <Typography
                      variant="caption"
                      sx={{ color: 'var(--text-tertiary)', display: 'block', mb: 1 }}
                    >
                      Formatos disponíveis:
                    </Typography>
                    <Box className="flex gap-1 flex-wrap">
                      {relatorio.formato.map((fmt) => (
                        <Chip
                          key={fmt}
                          label={fmt}
                          size="small"
                          sx={{
                            backgroundColor: 'var(--bg-hover)',
                            color: 'var(--text-primary)',
                            fontSize: '0.7rem'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{ color: 'var(--text-tertiary)', mb: 2, display: 'block' }}
                  >
                    Atualizado: {relatorio.ultimaAtualizacao}
                  </Typography>

                  <Divider sx={{ borderColor: 'var(--border-default)', mb: 2 }} />

                  <Box className="flex gap-2">
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Visibility />}
                      onClick={() => handleVisualizarPreview(relatorio)}
                      sx={{
                        color: 'var(--text-primary)',
                        borderColor: 'var(--border-default)',
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: 'var(--color-primary)',
                          backgroundColor: 'var(--bg-hover)'
                        }
                      }}
                    >
                      Preview
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Download />}
                      onClick={() => handleGerarRelatorio(relatorio)}
                      sx={{
                        backgroundColor: 'var(--color-primary)',
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: 'var(--color-primary-hover)',
                        }
                      }}
                    >
                      Gerar
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Seção de Preview de Dados */}
      <Typography
        variant="h5"
        sx={{
          color: 'var(--text-primary)',
          fontWeight: 700,
          mb: 3
        }}
      >
        Visualização Rápida dos Dados
      </Typography>

      <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de Evolução de Vendas */}
        <Box>
          <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <CardContent>
              <Box className="flex items-center justify-between mb-3">
                <Typography
                  variant="h6"
                  sx={{
                    color: 'var(--text-primary)',
                    fontWeight: 600
                  }}
                >
                  Evolução de Vendas (Últimos 7 meses)
                </Typography>
                <Tooltip 
                  title="Gráfico de linha que mostra a evolução do volume de vendas mês a mês. Permite identificar tendências de crescimento ou queda e sazonalidades no negócio."
                  placement="top"
                  arrow
                >
                  <IconButton 
                    size="small"
                    sx={{ 
                      color: 'var(--text-secondary)',
                      '&:hover': { color: 'var(--color-primary)' }
                    }}
                  >
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dadosVendasMes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                  <XAxis
                    dataKey="mes"
                    stroke="var(--text-tertiary)"
                    style={{ fontSize: '0.875rem' }}
                  />
                  <YAxis
                    stroke="var(--text-tertiary)"
                    style={{ fontSize: '0.875rem' }}
                    tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }}
                    formatter={(value: number | undefined) => [
                      `R$ ${(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                      'Vendas'
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    stroke="var(--color-primary)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--color-primary)', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Gráfico de Categorias */}
        <Box>
          <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <CardContent>
              <Box className="flex items-center justify-between mb-3">
                <Typography
                  variant="h6"
                  sx={{
                    color: 'var(--text-primary)',
                    fontWeight: 600
                  }}
                >
                  Vendas por Categoria
                </Typography>
                <Tooltip 
                  title="Gráfico de pizza que apresenta a distribuição proporcional das vendas entre diferentes categorias de seguros. Os percentuais facilitam a identificação das categorias mais representativas."
                  placement="top"
                  arrow
                >
                  <IconButton 
                    size="small"
                    sx={{ 
                      color: 'var(--text-secondary)',
                      '&:hover': { color: 'var(--color-primary)' }
                    }}
                  >
                    <InfoOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dadosCategorias}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.nome}: ${((entry.valor / dadosCategorias.reduce((acc, cat) => acc + cat.valor, 0)) * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    {dadosCategorias.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '8px',
                      color: 'var(--text-primary)'
                    }}
                    formatter={(value: number | undefined) => [
                      `R$ ${(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                      'Total'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Tabela de Top Corretores */}
      <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              color: 'var(--text-primary)',
              fontWeight: 600,
              mb: 3
            }}
          >
            Top 5 Corretores do Mês
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'var(--bg-table-header)' }}>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Posição</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Corretor</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Vendas</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Valor Total</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Performance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topCorretoresData.map((corretor, index) => (
                  <TableRow
                    key={corretor.nome}
                    sx={{
                      '&:hover': { backgroundColor: 'var(--bg-table-row-hover)' }
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'var(--bg-hover)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          color: index < 3 ? 'white' : 'var(--text-primary)',
                          fontSize: '0.875rem'
                        }}
                      >
                        {index + 1}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {corretor.nome}
                    </TableCell>
                    <TableCell sx={{ color: 'var(--text-secondary)' }}>
                      {corretor.vendas} vendas
                    </TableCell>
                    <TableCell sx={{ color: 'var(--color-success)', fontWeight: 600 }}>
                      R$ {corretor.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUp sx={{ color: 'var(--color-success)', fontSize: 20 }} />
                        <Typography sx={{ color: 'var(--color-success)', fontWeight: 600 }}>
                          +{(15 - index * 2)}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog de Preview */}
      <Dialog
        open={openPreview}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'var(--bg-card)',
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {relatorioSelecionado?.nome}
        </DialogTitle>
        <DialogContent>
          {renderPreviewContent()}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleClosePreview}
            sx={{
              color: 'var(--text-secondary)',
              textTransform: 'none'
            }}
          >
            Fechar
          </Button>
          <Button
            onClick={() => {
              if (relatorioSelecionado) {
                handleGerarRelatorio(relatorioSelecionado);
                handleClosePreview();
              }
            }}
            variant="contained"
            startIcon={<Download />}
            sx={{
              backgroundColor: 'var(--color-primary)',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'var(--color-primary-hover)',
              }
            }}
          >
            Gerar Relatório
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
