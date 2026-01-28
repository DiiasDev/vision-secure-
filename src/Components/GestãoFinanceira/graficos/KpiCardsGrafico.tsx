import { Card, CardContent, Typography, Box, IconButton, Tooltip } from '@mui/material';
import { TrendingUp, TrendingDown, InfoOutlined } from '@mui/icons-material';

interface KpiCardGraficoProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

export default function KpiCardGrafico({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  description 
}: KpiCardGraficoProps) {
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
          <Box className="flex items-center gap-2">
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
            {description && (
              <Tooltip 
                title={description}
                placement="top"
                arrow
                sx={{
                  '& .MuiTooltip-tooltip': {
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-default)',
                    fontSize: '0.875rem',
                    maxWidth: 300
                  },
                  '& .MuiTooltip-arrow': {
                    color: 'var(--bg-card)',
                  }
                }}
              >
                <IconButton 
                  size="small"
                  sx={{ 
                    color: 'var(--text-tertiary)',
                    '&:hover': { color: 'var(--color-primary)' }
                  }}
                >
                  <InfoOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
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
}
