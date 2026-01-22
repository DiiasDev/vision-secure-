import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown, AttachMoney, People, Assignment, CompareArrows } from '@mui/icons-material';

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const KpiCard = ({ title, value, change, icon, color }: KpiCardProps) => {
  const isPositive = change >= 0;
  
  return (
    <Card 
      className="h-full hover:shadow-lg transition-shadow duration-300"
      sx={{ 
        backgroundColor: 'var(--bg-card)',
        borderRadius: 2,
        border: '1px solid var(--border-default)'
      }}
    >
      <CardContent>
        <Box className="flex items-start justify-between mb-4">
          <Box 
            sx={{ 
              backgroundColor: `${color}15`,
              borderRadius: 2,
              padding: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box sx={{ color: color, display: 'flex' }}>
              {icon}
            </Box>
          </Box>
          <Box className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp sx={{ fontSize: 20, color: 'var(--color-success)' }} />
            ) : (
              <TrendingDown sx={{ fontSize: 20, color: 'var(--color-danger)' }} />
            )}
            <Typography 
              variant="body2" 
              sx={{ 
                color: isPositive ? 'var(--color-success)' : 'var(--color-danger)',
                fontWeight: 600
              }}
            >
              {isPositive ? '+' : ''}{change}%
            </Typography>
          </Box>
        </Box>
        
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'var(--text-primary)',
            fontWeight: 700,
            mb: 1
          }}
        >
          {value}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'var(--text-secondary)',
            fontSize: '0.875rem'
          }}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default function KpiCards() {
  const kpis = [
    {
      title: 'Receita Total',
      value: 'R$ 487.500',
      change: 12.5,
      icon: <AttachMoney sx={{ fontSize: 28 }} />,
      color: '#16a34a'
    },
    {
      title: 'Total de Vendas',
      value: '156',
      change: 8.3,
      icon: <Assignment sx={{ fontSize: 28 }} />,
      color: '#2563eb'
    },
    {
      title: 'Corretores Ativos',
      value: '24',
      change: 5.2,
      icon: <People sx={{ fontSize: 28 }} />,
      color: '#8b5cf6'
    },
    {
      title: 'Ticket Médio',
      value: 'R$ 3.125',
      change: -2.1,
      icon: <CompareArrows sx={{ fontSize: 28 }} />,
      color: '#d97706'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {kpis.map((kpi, index) => (
        <KpiCard key={index} {...kpi} />
      ))}
    </div>
  );
}
