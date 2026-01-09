import { useState } from 'react';
import { Card, CardContent, Chip, Avatar, IconButton, Collapse } from '@mui/material';
import { 
  DirectionsCar,
  Home,
  Business,
  Favorite,
  Flight,
  MoreHoriz,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import type { seguro } from '../../Types/seguros.types';
import { formatDate } from '../../Utils/Formatter';

interface SeguroCardProps {
  seguro: seguro;
}

export function SeguroCard({ seguro }: SeguroCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getTipoIcon = () => {
    switch (seguro.tipo_seguro) {
      case 'Auto':
        return <DirectionsCar />;
      case 'Residencial':
        return <Home />;
      case 'Empresarial':
        return <Business />;
      case 'Vida':
        return <Favorite />;
      case 'Viagem':
        return <Flight />;
      default:
        return <MoreHoriz />;
    }
  };

  const getStatusColor = () => {
    switch (seguro.status_segurado) {
      case 'Ativo':
        return 'success';
      case 'Inativo':
        return 'default';
      case 'Cancelado':
        return 'error';
      case 'Suspenso':
        return 'warning';
      case 'Vencido':
        return 'error';
      default:
        return 'default';
    }
  };

  const getSituacaoPagamentoColor = () => {
    switch (seguro.situacao_pagamento) {
      case 'Pago':
        return 'success';
      case 'Pendente':
        return 'warning';
      case 'Atrasado':
        return 'error';
      case 'Cancelado':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', gap: '12px' }}>
          <Avatar sx={{ bgcolor: 'var(--color-primary)', width: 48, height: 48 }}>
            {getTipoIcon()}
          </Avatar>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: '1.1rem', 
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {seguro.numero_apolice}
            </h3>
            <p style={{ 
              margin: '4px 0 0 0', 
              fontSize: '0.875rem', 
              color: 'var(--text-secondary)' 
            }}>
              {seguro.tipo_seguro}
            </p>
          </div>

          <IconButton 
            size="small" 
            onClick={() => setExpanded(!expanded)}
            sx={{ alignSelf: 'flex-start' }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <Chip 
            label={seguro.status_segurado} 
            size="small" 
            color={getStatusColor()}
          />
          <Chip 
            label={seguro.situacao_pagamento} 
            size="small" 
            color={getSituacaoPagamentoColor()}
            variant="outlined"
          />
        </div>

        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <div style={{ marginBottom: '8px' }}>
            <strong>Segurado:</strong> {seguro.segurado}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Seguradora:</strong> {seguro.seguradora}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>Vigência:</strong> {formatDate(seguro.inicio_vigencia)} - {formatDate(seguro.fim_vigencia)}
          </div>
        </div>

        <Collapse in={expanded}>
          <div style={{ 
            marginTop: '12px', 
            paddingTop: '12px', 
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Corretor:</strong> {seguro.corretor_responsavel}
            </div>
            {seguro.veiculo && (
              <div style={{ marginBottom: '8px' }}>
                <strong>Veículo:</strong> {seguro.veiculo}
              </div>
            )}
            <div style={{ marginBottom: '8px' }}>
              <strong>Valor Prêmio:</strong> {formatCurrency(seguro.valor_premio)}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Franquia:</strong> {formatCurrency(seguro.valor_franquia)}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Forma Pagamento:</strong> {seguro.forma_pagamento}
            </div>
          </div>
        </Collapse>
      </CardContent>
    </Card>
  );
}
