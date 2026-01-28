import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState } from 'react';
import InfoModal from '../InfoModal';

interface VendaPorCategoriaCorretor {
  corretor: string;
  auto: number;
  vida: number;
  residencial: number;
  empresarial: number;
  outros: number;
}

interface VendasPorCategoriaCorretorGraficoProps {
  data: VendaPorCategoriaCorretor[];
  loading?: boolean;
  error?: string;
}

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

export default function VendasPorCategoriaCorretorGrafico({ 
  data, 
  loading = false, 
  error 
}: VendasPorCategoriaCorretorGraficoProps) {
  const [infoOpen, setInfoOpen] = useState(false);

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
        title="Vendas por Categoria por Corretor"
        description="Gráfico de barras empilhadas que detalha o desempenho individual de cada corretor segmentado por categoria de produto."
        details={[
          "Cada barra representa um corretor e suas vendas totais",
          "As cores dentro das barras mostram a contribuição de cada categoria de seguro",
          "Compare o desempenho entre corretores e identifique especialidades",
          "Use os filtros para analisar períodos específicos, corretores individuais ou categorias",
          "Os cards resumo no final mostram o total vendido em cada categoria"
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
                  Vendas por Categoria por Corretor
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: 'var(--text-secondary)' }}
                >
                  Desempenho detalhado por tipo de seguro
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
          </Box>

          <Box className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={data}>
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
              const total = data.reduce((acc, item) => acc + (item as any)[categoria.key], 0);
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
    </>
  );
}
