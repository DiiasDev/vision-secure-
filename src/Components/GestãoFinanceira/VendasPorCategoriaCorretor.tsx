import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import DateRangeFilter from './DateRangeFilter';
import CorretorFilter from './CorretorFilter';
import CategoriaFilter from './CategoriaFilter';

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

const categorias = [
  { key: 'auto', name: 'Auto', color: '#2563eb' },
  { key: 'vida', name: 'Vida', color: '#16a34a' },
  { key: 'residencial', name: 'Residencial', color: '#8b5cf6' },
  { key: 'empresarial', name: 'Empresarial', color: '#d97706' },
  { key: 'outros', name: 'Outros', color: '#64748b' }
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

export default function VendasPorCategoriaCorretor() {
  return (
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
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'var(--text-primary)',
                fontWeight: 600,
                mb: 0.5
              }}
            >
              Vendas por Categoria por Corretor
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: 'var(--text-secondary)' }}
            >
              Desempenho detalhado por tipo de seguro
            </Typography>
          </Box>
          
          <Box className="flex items-center gap-2 flex-wrap">
            <DateRangeFilter />
            <CorretorFilter />
            <CategoriaFilter />
          </Box>
        </Box>

        <Box className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={vendasPorCategoriaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
              <XAxis 
                dataKey="corretor" 
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
              {categorias.map((categoria) => (
                <Bar 
                  key={categoria.key}
                  dataKey={categoria.key} 
                  stackId="a"
                  fill={categoria.color}
                  name={categoria.name}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Summary Cards */}
        <Box className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4 pt-4 border-t" sx={{ borderColor: 'var(--border-default)' }}>
          {categorias.map((categoria) => {
            const total = vendasPorCategoriaData.reduce((acc, item) => acc + (item as any)[categoria.key], 0);
            return (
              <Box 
                key={categoria.key}
                className="p-3 rounded-lg"
                sx={{ 
                  backgroundColor: 'var(--bg-hover)',
                  border: '1px solid var(--border-default)'
                }}
              >
                <Box className="flex items-center gap-2 mb-1">
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      backgroundColor: categoria.color 
                    }} 
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}
                  >
                    {categoria.name}
                  </Typography>
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'var(--text-primary)',
                    fontWeight: 700,
                    fontSize: '1.125rem'
                  }}
                >
                  R$ {total.toLocaleString('pt-BR')}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
