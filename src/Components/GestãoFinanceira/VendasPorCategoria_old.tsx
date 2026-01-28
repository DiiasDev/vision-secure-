import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useState } from 'react';
import DateRangeFilter from './DateRangeFilter';
import InfoModal from './InfoModal';

const categoriaData = [
  { name: 'Auto', value: 185000, color: '#2563eb' },
  { name: 'Vida', value: 125000, color: '#16a34a' },
  { name: 'Residencial', value: 95000, color: '#8b5cf6' },
  { name: 'Empresarial', value: 65000, color: '#d97706' },
  { name: 'Outros', value: 17500, color: '#64748b' }
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const total = categoriaData.reduce((acc, item) => acc + item.value, 0);
    const percentage = ((data.value / total) * 100).toFixed(1);
    
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
        <Typography variant="body2" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 0.5 }}>
          {data.name}
        </Typography>
        <Typography variant="body2" sx={{ color: data.payload.color, fontSize: '0.875rem' }}>
          R$ {data.value.toLocaleString('pt-BR')}
        </Typography>
        <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
          {percentage}% do total
        </Typography>
      </Box>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      style={{ fontSize: '0.875rem', fontWeight: 600 }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function VendasPorCategoria() {
  const total = categoriaData.reduce((acc, item) => acc + item.value, 0);
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <>
    <InfoModal 
      open={infoOpen}
      onClose={() => setInfoOpen(false)}
      title="Vendas por Categoria"
      description="Este gráfico de pizza apresenta a distribuição proporcional das vendas entre as diferentes categorias de seguros oferecidas."
      details={[
        "Cada fatia representa uma categoria de seguro (Auto, Vida, Residencial, Empresarial, Outros)",
        "O tamanho da fatia é proporcional ao volume de vendas da categoria",
        "Os percentuais mostram a participação de cada categoria no total de vendas",
        "Use este gráfico para identificar quais produtos têm maior demanda e planejar estratégias comerciais"
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
                Vendas por Categoria
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ color: 'var(--text-secondary)' }}
              >
                Distribuição de produtos vendidos
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
          
          <DateRangeFilter />
        </Box>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoriaData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {categoriaData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <Box className="mt-4 space-y-2">
          {categoriaData.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <Box key={index} className="flex items-center justify-between p-2 rounded" sx={{ backgroundColor: 'var(--bg-hover)' }}>
                <Box className="flex items-center gap-2">
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      backgroundColor: item.color 
                    }} 
                  />
                  <Typography variant="body2" sx={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                </Box>
                <Box className="text-right">
                  <Typography variant="body2" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    R$ {item.value.toLocaleString('pt-BR')}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                    {percentage}%
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
    </>
  );
}
