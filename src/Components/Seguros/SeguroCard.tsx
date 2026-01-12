import { useState } from 'react';
import { Card, CardContent, Chip, Avatar, IconButton, Collapse, Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText, Box, Tooltip } from '@mui/material';
import { 
  DirectionsCar,
  Home,
  Business,
  Favorite,
  Flight,
  MoreHoriz,
  ExpandMore,
  ExpandLess,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { seguro } from '../../Types/seguros.types';
import { formatDate } from '../../Utils/Formatter';
import { deletarSeguro } from '../../Services/Seguros';

interface SeguroCardProps {
  seguro: seguro;
  onEdit?: (seguro: seguro) => void;
  onDelete?: () => void;
}

export function SeguroCard({ seguro, onEdit, onDelete }: SeguroCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await deletarSeguro(seguro.name);
      setDeleteDialogOpen(false);
      if (onDelete) onDelete();
    } catch (error: any) {
      console.error('Erro ao deletar seguro:', error);
      const errorMessage = error.message || 'Erro ao deletar seguro. Tente novamente.';
      alert(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

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

          <div style={{ display: 'flex', gap: '4px' }}>
            {onEdit && (
              <Tooltip title="Editar">
                <IconButton
                  size="small"
                  onClick={() => onEdit(seguro)}
                  sx={{
                    color: 'var(--color-primary)',
                    '&:hover': {
                      backgroundColor: 'var(--color-primary-light)',
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Deletar">
              <IconButton
                size="small"
                onClick={handleDeleteClick}
                sx={{
                  color: '#ef4444',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <IconButton 
              size="small" 
              onClick={() => setExpanded(!expanded)}
              sx={{ alignSelf: 'flex-start' }}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </div>
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

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '8px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DeleteIcon sx={{ color: '#ef4444', fontSize: 20 }} />
            </Box>
            <span style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 600 }}>
              Confirmar Exclusão
            </span>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText sx={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Tem certeza que deseja excluir o seguro{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {seguro.numero_apolice}
            </strong>
            ? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            disabled={deleting}
            sx={{
              color: 'var(--text-secondary)',
              borderColor: 'var(--border-default)',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                borderColor: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-sidebar-hover)',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            disabled={deleting}
            sx={{
              backgroundColor: '#ef4444',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#dc2626',
              },
              '&:disabled': {
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
              },
            }}
          >
            {deleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
