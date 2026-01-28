import { useState } from 'react';
import { Card, CardContent, Typography, Box, Avatar, LinearProgress, Chip, ToggleButton, ToggleButtonGroup, IconButton } from '@mui/material';
import { EmojiEvents, TrendingUp, TrendingDown, ViewList, BarChart as BarChartIcon, ShowChart, InfoOutlined } from '@mui/icons-material';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import DateRangeFilter from './DateRangeFilter';
import CorretorFilter from './CorretorFilter';
import InfoModal from './InfoModal';

interface Corretor {
  id: number;
  nome: string;
  vendas: number;
  meta: number;
  crescimento: number;
  posicao: number;
  avatar: string;
}

const corretoresData: Corretor[] = [
  { id: 1, nome: 'Carlos Silva', vendas: 145000, meta: 120000, crescimento: 18.5, posicao: 1, avatar: 'CS' },
  { id: 2, nome: 'Ana Santos', vendas: 132000, meta: 110000, crescimento: 15.2, posicao: 2, avatar: 'AS' },
  { id: 3, nome: 'Roberto Lima', vendas: 118000, meta: 100000, crescimento: 12.8, posicao: 3, avatar: 'RL' },
  { id: 4, nome: 'Mariana Costa', vendas: 95000, meta: 90000, crescimento: 8.4, posicao: 4, avatar: 'MC' },
  { id: 5, nome: 'Pedro Oliveira', vendas: 87000, meta: 90000, crescimento: -3.2, posicao: 5, avatar: 'PO' },
  { id: 6, nome: 'Julia Ferreira', vendas: 78000, meta: 80000, crescimento: 5.7, posicao: 6, avatar: 'JF' },
  { id: 7, nome: 'Lucas Almeida', vendas: 72000, meta: 75000, crescimento: -1.5, posicao: 7, avatar: 'LA' },
  { id: 8, nome: 'Beatriz Souza', vendas: 68000, meta: 70000, crescimento: 2.1, posicao: 8, avatar: 'BS' }
];

const getMedalColor = (posicao: number) => {
  switch (posicao) {
    case 1: return '#FFD700';
    case 2: return '#C0C0C0';
    case 3: return '#CD7F32';
    default: return 'var(--text-tertiary)';
  }
};

const CorretorCard = ({ corretor }: { corretor: Corretor }) => {
  const percentualMeta = (corretor.vendas / corretor.meta) * 100;
  const isPositivo = corretor.crescimento >= 0;
  const atingiuMeta = percentualMeta >= 100;

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
            {isPositivo ? (
              <TrendingUp sx={{ fontSize: 18, color: 'var(--color-success)' }} />
            ) : (
              <TrendingDown sx={{ fontSize: 18, color: 'var(--color-danger)' }} />
            )}
            <Typography 
              variant="body2" 
              sx={{ 
                color: isPositivo ? 'var(--color-success)' : 'var(--color-danger)',
                fontWeight: 600
              }}
            >
              {isPositivo ? '+' : ''}{corretor.crescimento}%
            </Typography>
          </Box>
          <Chip 
            label={atingiuMeta ? 'Meta Atingida' : `${percentualMeta.toFixed(0)}% da meta`}
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

export default function RankingCorretores() {
  const [viewMode, setViewMode] = useState<'list' | 'bar' | 'line'>('list');
  const [infoOpen, setInfoOpen] = useState(false);

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: 'list' | 'bar' | 'line' | null) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const chartData = corretoresData.map(c => ({
    nome: c.nome.split(' ')[0], // Primeiro nome
    vendas: c.vendas / 1000, // Em milhares
    meta: c.meta / 1000
  }));

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
          
          <Box className="flex items-center gap-2 flex-wrap">
            <DateRangeFilter />
            <CorretorFilter />
            
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
                    backgroundColor: 'var(--bg-hover)',
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
        </Box>

        {viewMode === 'list' ? (
          <Box className="space-y-3">
            {corretoresData.map((corretor) => (
              <CorretorCard key={corretor.id} corretor={corretor} />
            ))}
          </Box>
        ) : viewMode === 'bar' ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 450 }}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
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
              <Bar 
                dataKey="meta" 
                fill="#94a3b8" 
                name="Meta"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="vendas" 
                fill="#2563eb" 
                name="Vendas"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 450 }}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
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
