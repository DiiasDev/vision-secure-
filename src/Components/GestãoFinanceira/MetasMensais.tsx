import { Card, CardContent, Typography, Box, LinearProgress, IconButton } from '@mui/material';
import { CheckCircle, Cancel, Schedule, InfoOutlined } from '@mui/icons-material';
import { useState } from 'react';
import DateRangeFilter from './DateRangeFilter';
import InfoModal from './InfoModal';

interface Meta {
  mes: string;
  meta: number;
  realizado: number;
  status: 'atingida' | 'nao-atingida' | 'em-andamento';
}

const metasData: Meta[] = [
  { mes: 'Janeiro', meta: 40000, realizado: 45000, status: 'atingida' },
  { mes: 'Fevereiro', meta: 45000, realizado: 52000, status: 'atingida' },
  { mes: 'Março', meta: 45000, realizado: 48000, status: 'atingida' },
  { mes: 'Abril', meta: 50000, realizado: 61000, status: 'atingida' },
  { mes: 'Maio', meta: 50000, realizado: 55000, status: 'atingida' },
  { mes: 'Junho', meta: 55000, realizado: 67000, status: 'atingida' },
  { mes: 'Julho', meta: 55000, realizado: 58000, status: 'atingida' },
  { mes: 'Agosto', meta: 60000, realizado: 62000, status: 'atingida' },
  { mes: 'Setembro', meta: 60000, realizado: 71000, status: 'atingida' },
  { mes: 'Outubro', meta: 65000, realizado: 68000, status: 'atingida' },
  { mes: 'Novembro', meta: 65000, realizado: 75000, status: 'atingida' },
  { mes: 'Dezembro', meta: 70000, realizado: 48500, status: 'em-andamento' }
];

const getStatusIcon = (status: Meta['status']) => {
  switch (status) {
    case 'atingida':
      return <CheckCircle sx={{ color: 'var(--color-success)', fontSize: 20 }} />;
    case 'nao-atingida':
      return <Cancel sx={{ color: 'var(--color-danger)', fontSize: 20 }} />;
    case 'em-andamento':
      return <Schedule sx={{ color: 'var(--color-warning)', fontSize: 20 }} />;
  }
};

const getStatusColor = (status: Meta['status']) => {
  switch (status) {
    case 'atingida':
      return 'var(--color-success)';
    case 'nao-atingida':
      return 'var(--color-danger)';
    case 'em-andamento':
      return 'var(--color-warning)';
  }
};

const MetaCard = ({ meta }: { meta: Meta }) => {
  const percentual = (meta.realizado / meta.meta) * 100;
  const diferenca = meta.realizado - meta.meta;
  const isPositivo = diferenca >= 0;

  return (
    <Box 
      className="p-4 rounded-lg"
      sx={{ 
        backgroundColor: 'var(--bg-hover)',
        border: '1px solid var(--border-default)',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'var(--border-strong)',
          boxShadow: 'var(--shadow-sm)'
        }
      }}
    >
      <Box className="flex items-center justify-between mb-3">
        <Box className="flex items-center gap-2">
          {getStatusIcon(meta.status)}
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: 'var(--text-primary)',
              fontWeight: 600
            }}
          >
            {meta.mes}
          </Typography>
        </Box>
        
        {meta.status !== 'em-andamento' && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: isPositivo ? 'var(--color-success)' : 'var(--color-danger)',
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          >
            {isPositivo ? '+' : ''}R$ {Math.abs(diferenca).toLocaleString('pt-BR')}
          </Typography>
        )}
      </Box>

      <Box className="mb-2">
        <Box className="flex justify-between mb-1">
          <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
            Meta: R$ {meta.meta.toLocaleString('pt-BR')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
            R$ {meta.realizado.toLocaleString('pt-BR')}
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={Math.min(percentual, 100)} 
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: 'var(--bg-tertiary)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: getStatusColor(meta.status),
              borderRadius: 3
            }
          }}
        />
      </Box>

      <Typography 
        variant="caption" 
        sx={{ 
          color: 'var(--text-secondary)',
          fontSize: '0.75rem'
        }}
      >
        {percentual.toFixed(1)}% da meta {meta.status === 'em-andamento' ? '(em andamento)' : ''}
      </Typography>
    </Box>
  );
};

export default function MetasMensais() {
  const metasAtingidas = metasData.filter(m => m.status === 'atingida').length;
  const totalMeses = metasData.filter(m => m.status !== 'em-andamento').length;
  const taxaSucesso = ((metasAtingidas / totalMeses) * 100).toFixed(1);
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <>
    <InfoModal 
      open={infoOpen}
      onClose={() => setInfoOpen(false)}
      title="Metas Mensais"
      description="Acompanhamento detalhado do cumprimento de metas estabelecidas para cada mês, permitindo avaliar a consistência do desempenho ao longo do ano."
      details={[
        "Ícone verde (check): Meta atingida - vendas superaram ou alcançaram o objetivo",
        "Ícone vermelho (X): Meta não atingida - vendas abaixo do esperado",
        "Ícone amarelo (relógio): Mês em andamento - ainda em processo",
        "A barra de progresso mostra visualmente o percentual de cumprimento da meta",
        "A taxa de sucesso no topo indica o percentual de metas alcançadas no período"
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
                Metas Mensais
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ color: 'var(--text-secondary)' }}
              >
                Acompanhamento anual de metas
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
          
          <Box className="flex items-center gap-3">
            <DateRangeFilter />
            
            <Box className="text-right">
              <Typography 
                variant="h4" 
                sx={{ 
                  color: 'var(--color-success)',
                  fontWeight: 700
                }}
              >
                {taxaSucesso}%
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ color: 'var(--text-tertiary)' }}
              >
                Taxa de Sucesso
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metasData.map((meta, index) => (
            <MetaCard key={index} meta={meta} />
          ))}
        </Box>
      </CardContent>
    </Card>
    </>
  );
}
