import { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Avatar, LinearProgress, Chip, ToggleButton, ToggleButtonGroup, IconButton } from '@mui/material';
import { EmojiEvents, TrendingUp, TrendingDown, ViewList, BarChart as BarChartIcon, ShowChart, InfoOutlined } from '@mui/icons-material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import InfoModal from '../InfoModal';
import { Financeiro } from '../../../Services/Financeiro';
import DateRangeFilter from '../DateRangeFilter';
import dayjs, { Dayjs } from 'dayjs';
interface Corretor {
  id: number;
  nome: string;
  vendas: number;
  meta: number;
  crescimento: number;
  posicao: number;
  avatar: string;
}

interface RankingCorretoresGraficoProps {
  data: Corretor[];
  loading?: boolean;
  error?: string;
}

const getMedalColor = (posicao: number) => {
  switch (posicao) {
    case 1: return '#FFD700';
    case 2: return '#C0C0C0';
    case 3: return '#CD7F32';
    default: return 'var(--text-tertiary)';
  }
};

const CorretorCard = ({ corretor }: { corretor: Corretor }) => {
  const percentualMeta =
    corretor.meta > 0 ? (corretor.vendas / corretor.meta) * 100 : 0;
  const isPositivo = corretor.crescimento > 0;
  const isNegativo = corretor.crescimento < 0;
  const crescimentoLabel = isPositivo
    ? `+${corretor.crescimento}%`
    : `${corretor.crescimento}%`;
  const crescimentoColor = isPositivo
    ? "var(--color-success)"
    : isNegativo
      ? "var(--color-danger)"
      : "var(--text-secondary)";
  const atingiuMeta = corretor.meta > 0 && percentualMeta >= 100;

  return (
    <Box 
      className="p-4 rounded-lg hover:bg-opacity-50 transition-all duration-200"
      sx={{ 
        backgroundColor: corretor.posicao <= 3 ? 'var(--bg-hover)' : 'transparent',
        border: '1px solid',
        borderColor: corretor.posicao <= 3 ? 'var(--border-strong)' : 'transparent',
        '&:hover': {
          backgroundColor: 'var(--bg-hover)',
          borderColor: 'var(--border-strong)'
        }
      }}
    >
      <Box className="flex items-center justify-between mb-3">
        <Box className="flex items-center gap-3">
          <Box className="relative">
            {corretor.posicao <= 3 && (
              <EmojiEvents 
                sx={{ 
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  fontSize: 20,
                  color: getMedalColor(corretor.posicao),
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                }} 
              />
            )}
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48,
                backgroundColor: 'var(--color-primary)',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              {corretor.avatar}
            </Avatar>
          </Box>
          
          <Box>
            <Box className="flex items-center gap-2">
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: 'var(--text-primary)',
                  fontWeight: 600
                }}
              >
                {corretor.nome}
              </Typography>
              {corretor.posicao <= 3 && (
                <Chip 
                  label={`${corretor.posicao}º`}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: `${getMedalColor(corretor.posicao)}20`,
                    color: getMedalColor(corretor.posicao)
                  }}
                />
              )}
            </Box>
            <Typography 
              variant="body2" 
              sx={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}
            >
              R$ {corretor.vendas.toLocaleString('pt-BR')} vendidos
            </Typography>
          </Box>
        </Box>

        <Box className="text-right">
          <Box className="flex items-center gap-1 justify-end mb-1">
            {isPositivo && (
              <TrendingUp sx={{ fontSize: 18, color: 'var(--color-success)' }} />
            )}
            {isNegativo && (
              <TrendingDown sx={{ fontSize: 18, color: 'var(--color-danger)' }} />
            )}
            <Typography 
              variant="body2" 
              sx={{ 
                color: crescimentoColor,
                fontWeight: 600
              }}
            >
              {crescimentoLabel}
            </Typography>
          </Box>
          <Chip 
            label={
              corretor.meta > 0
                ? atingiuMeta
                  ? 'Meta Atingida'
                  : `${percentualMeta.toFixed(0)}% da meta`
                : 'Sem meta'
            }
            size="small"
            sx={{
              height: 22,
              fontSize: '0.75rem',
              backgroundColor: atingiuMeta ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
              color: atingiuMeta ? 'var(--color-success)' : 'var(--color-warning)',
              fontWeight: 600
            }}
          />
        </Box>
      </Box>

      <Box>
        <Box className="flex justify-between mb-1">
          <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
            Progresso da Meta
          </Typography>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'var(--text-primary)',
              fontWeight: 600
            }}
          >
            {percentualMeta.toFixed(1)}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={Math.min(percentualMeta, 100)} 
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'var(--bg-tertiary)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: atingiuMeta ? 'var(--color-success)' : 'var(--color-primary)',
              borderRadius: 4
            }
          }}
        />
      </Box>
    </Box>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box 
        sx={{ 
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 1,
          padding: 2,
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <Typography variant="body2" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 1 }}>
          {payload[0].payload.nome}
        </Typography>
        {payload.map((entry: any, index: number) => (
          <Typography 
            key={index} 
            variant="body2" 
            sx={{ color: entry.color, fontSize: '0.875rem' }}
          >
            {entry.name}: R$ {(entry.value * 1000).toLocaleString('pt-BR')}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

export default function RankingCorretoresGrafico({ 
  loading = false, 
  error 
}: RankingCorretoresGraficoProps) {
  const [viewMode, setViewMode] = useState<'list' | 'bar' | 'line'>('list');
  const [infoOpen, setInfoOpen] = useState(false);
  const [data, setData] = useState<Corretor[]>([]);
  const [dateRange, setDateRange] = useState<{ start: Dayjs | null; end: Dayjs | null }>(() => {
    const today = dayjs();
    const start = dayjs().subtract(30, 'days');
    return { start, end: today };
  });
  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: 'list' | 'bar' | 'line' | null) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  useEffect(() => {
    if (!dateRange.start || !dateRange.end) {
      setData([]);
      return;
    }
    const financeiro = new Financeiro();
    const start = dateRange.start.format('YYYY-MM-DD');
    const end = dateRange.end.format('YYYY-MM-DD');
    financeiro.getMetasPorCorretorRanking(start, end).then((dados) => {
      if (Array.isArray(dados)) {
        const dataCompletada = dados.map((item: any, idx: number) => {
          const meta = item.meta || 0;
          const crescimento = Number(item.crescimento || 0);
          const avatar = (item.nome || '?').charAt(0).toUpperCase();
          return {
            id: item.id ?? idx + 1,
            nome: item.nome || 'Sem Nome',
            vendas: item.vendas || 0,
            meta,
            crescimento,
            posicao: idx + 1,
            avatar,
          };
        });
        setData(dataCompletada);
      }
    });
  }, [dateRange]);

  const chartData = data.map(c => ({
    nome: c.nome.split(' ')[0],
    vendas: c.vendas / 1000,
    meta: c.meta / 1000
  }));

  if (error) {
    return (
      <Card sx={{ backgroundColor: 'var(--bg-card)', borderRadius: 2, border: '1px solid var(--border-default)' }}>
        <CardContent>
          <Typography color="error">Erro ao carregar dados: {error}</Typography>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card sx={{ backgroundColor: 'var(--bg-card)', borderRadius: 2, border: '1px solid var(--border-default)' }}>
        <CardContent>
          <Typography>Carregando...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <InfoModal 
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        title="Ranking de Corretores"
        description="Visualização completa do desempenho dos corretores, destacando os top performers e oferecendo múltiplas formas de análise."
        details={[
          "Os 3 primeiros colocados recebem medalhas de destaque (ouro, prata e bronze)",
          "Cada corretor mostra vendas totais, percentual de crescimento e progresso em relação à meta",
          "Visualização em Lista: Mostra cards detalhados com todas as métricas",
          "Visualização em Barras: Compara vendas vs metas em gráfico",
          "Visualização em Linha: Mostra tendência e evolução do desempenho"
        ]}
      />
      <Card 
        sx={{ 
          backgroundColor: 'var(--bg-card)',
          borderRadius: 2,
          border: '1px solid var(--border-default)',
          height: '100%'
        }}
      >
        <CardContent>
          <Box className="flex flex-wrap gap-3 mb-4 items-center">
            <DateRangeFilter onDateRangeChange={(start, end) => setDateRange({ start, end })} />
          </Box>
          <Box className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <Box className="flex items-center gap-2">
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    mb: 0.5
                  }}
                >
                  Ranking de Corretores
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: 'var(--text-secondary)' }}
                >
                  Top performers do período
                </Typography>
              </Box>
              <IconButton 
                size="small"
                onClick={() => setInfoOpen(true)}
                sx={{ 
                  color: 'var(--text-secondary)',
                  '&:hover': { color: 'var(--color-primary)' }
                }}
              >
                <InfoOutlined fontSize="small" />
              </IconButton>
            </Box>
            
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewChange}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  color: 'var(--text-secondary)',
                  borderColor: 'var(--border-default)',
                  padding: '6px 12px',
                  '&.Mui-selected': {
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'var(--color-primary-hover)',
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'var(--bg-hover)'
                  }
                }
              }}
            >
              <ToggleButton value="list">
                <ViewList sx={{ fontSize: 20 }} />
              </ToggleButton>
              <ToggleButton value="bar">
                <BarChartIcon sx={{ fontSize: 20 }} />
              </ToggleButton>
              <ToggleButton value="line">
                <ShowChart sx={{ fontSize: 20 }} />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {viewMode === 'list' && (
            <Box className="space-y-3">
              {data.map((corretor) => (
                <CorretorCard key={corretor.id} corretor={corretor} />
              ))}
            </Box>
          )}

          {viewMode === 'bar' && (
            <Box sx={{ mt: 2 }}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                  <XAxis 
                    dataKey="nome" 
                    stroke="var(--text-secondary)"
                    style={{ fontSize: '0.75rem' }}
                  />
                  <YAxis 
                    stroke="var(--text-secondary)"
                    style={{ fontSize: '0.75rem' }}
                    tickFormatter={(value) => `R$ ${value}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Bar dataKey="meta" fill="#94a3b8" name="Meta" />
                  <Bar dataKey="vendas" fill="#2563eb" name="Vendas" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}

          {viewMode === 'line' && (
            <Box sx={{ mt: 2 }}>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
                  <XAxis 
                    dataKey="nome" 
                    stroke="var(--text-secondary)"
                    style={{ fontSize: '0.75rem' }}
                  />
                  <YAxis 
                    stroke="var(--text-secondary)"
                    style={{ fontSize: '0.75rem' }}
                    tickFormatter={(value) => `R$ ${value}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="meta" 
                    stroke="#94a3b8" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Meta"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="vendas" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Vendas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </CardContent>
      </Card>
    </>
  );
}
