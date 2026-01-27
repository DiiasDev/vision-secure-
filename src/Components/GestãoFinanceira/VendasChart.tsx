import { Card, CardContent, Typography, Box, Tabs, Tab, IconButton } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState } from 'react';
import DateRangeFilter from './DateRangeFilter';
import InfoModal from './InfoModal';

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

const CustomTooltip = ({ active, payload, label }: any) => {
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
          {label}
        </Typography>
        {payload.map((entry: any, index: number) => (
          <Typography 
            key={index} 
            variant="body2" 
            sx={{ color: entry.color, fontSize: '0.875rem' }}
          >
            {entry.name}: R$ {entry.value.toLocaleString('pt-BR')}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

export default function VendasChart() {
  const [chartType, setChartType] = useState<'area' | 'line'>('area');
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <>
    <InfoModal 
      open={infoOpen}
      onClose={() => setInfoOpen(false)}
      title="Evolução de Vendas"
      description="Este gráfico apresenta a evolução mensal das vendas comparando três indicadores importantes para avaliar o desempenho comercial."
      details={[
        "Vendas Atuais: Mostra o volume de vendas realizado em cada mês do ano corrente",
        "Meta: Representa os objetivos estabelecidos para cada período",
        "Ano Anterior: Permite comparar o desempenho atual com o mesmo período do ano passado",
        "Você pode alternar entre visualização em Área ou Linha para melhor análise dos dados"
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
                Evolução de Vendas
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ color: 'var(--text-secondary)' }}
              >
                Comparativo anual de performance
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
            
            <Tabs 
              value={chartType} 
              onChange={(_, newValue) => setChartType(newValue)}
              sx={{
                minHeight: 'auto',
                '& .MuiTab-root': {
                  minHeight: 'auto',
                  padding: '6px 12px',
                  fontSize: '0.875rem'
                }
              }}
            >
              <Tab label="Área" value="area" />
              <Tab label="Linha" value="line" />
            </Tabs>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 450 }}>
          <ResponsiveContainer width="100%" height={400}>
            {chartType === 'area' ? (
              <AreaChart data={vendasData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <defs>
                <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMeta" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAnterior" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
              <XAxis 
                dataKey="mes" 
                stroke="var(--text-secondary)"
                style={{ fontSize: '0.75rem' }}
              />
              <YAxis 
                stroke="var(--text-secondary)"
                style={{ fontSize: '0.75rem' }}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Area 
                type="monotone" 
                dataKey="ano_anterior" 
                stroke="#94a3b8" 
                fill="url(#colorAnterior)"
                strokeWidth={2}
                name="Ano Anterior"
              />
              <Area 
                type="monotone" 
                dataKey="meta" 
                stroke="#16a34a" 
                fill="url(#colorMeta)"
                strokeWidth={2}
                name="Meta"
              />
              <Area 
                type="monotone" 
                dataKey="vendas" 
                stroke="#2563eb" 
                fill="url(#colorVendas)"
                strokeWidth={2}
                name="Vendas Atuais"
              />
            </AreaChart>
            ) : (
            <LineChart data={vendasData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
              <XAxis 
                dataKey="mes" 
                stroke="var(--text-secondary)"
                style={{ fontSize: '0.75rem' }}
              />
              <YAxis 
                stroke="var(--text-secondary)"
                style={{ fontSize: '0.75rem' }}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Line 
                type="monotone" 
                dataKey="ano_anterior" 
                stroke="#94a3b8" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Ano Anterior"
              />
              <Line 
                type="monotone" 
                dataKey="meta" 
                stroke="#16a34a" 
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
                name="Vendas Atuais"
              />
            </LineChart>
          )}
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
    </>
  );
}
