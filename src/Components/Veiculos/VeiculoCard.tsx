import { useState } from 'react';
import {
  Card,
  CardContent,
  Avatar,
  IconButton,
  Collapse,
  Box,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  TwoWheeler as MotoIcon,
  LocalShipping as TruckIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  Palette as ColorIcon,
  LocalGasStation as FuelIcon,
  CalendarToday as CalendarIcon,
  WorkOutline as WorkIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { veiculo } from '../../Types/veiculos.types';
import { formatDate } from '../../Utils/Formatter';
import { getInitials } from '../../Utils/StringHelpers';
import { deletarVeiculo } from '../../Services/veiculos';

interface VeiculoCardProps {
  veiculo: veiculo;
  onEdit?: (veiculo: veiculo) => void;
  onDelete?: () => void;
}

export function VeiculoCard({ veiculo, onEdit, onDelete }: VeiculoCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await deletarVeiculo(veiculo.name);
      setDeleteDialogOpen(false);
      if (onDelete) onDelete();
    } catch (error: any) {
      console.error('Erro ao deletar veículo:', error);
      const errorMessage = error.message || 'Erro ao deletar veículo. Tente novamente.';
      alert(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const getTipoIcon = () => {
    switch (veiculo.tipo_veiculo) {
      case 'Carro':
      case 'Utilitário':
        return <CarIcon sx={{ fontSize: 24 }} />;
      case 'Moto':
        return <MotoIcon sx={{ fontSize: 24 }} />;
      case 'Caminhão':
        return <TruckIcon sx={{ fontSize: 24 }} />;
      default:
        return <CarIcon sx={{ fontSize: 24 }} />;
    }
  };

  const getTipoColor = () => {
    switch (veiculo.tipo_veiculo) {
      case 'Carro':
        return { bg: 'var(--color-primary-light)', color: 'var(--color-primary)' };
      case 'Moto':
        return { bg: 'var(--color-accent-light)', color: 'var(--color-accent)' };
      case 'Caminhão':
        return { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)' };
      case 'Utilitário':
        return { bg: 'var(--color-info-bg)', color: 'var(--color-info)' };
      default:
        return { bg: 'var(--color-primary-light)', color: 'var(--color-primary)' };
    }
  };

  const getUsoColor = () => {
    switch (veiculo.uso_veiculo) {
      case 'Particular':
        return { bg: 'var(--color-success-bg)', color: 'var(--color-success)' };
      case 'Comercial':
        return { bg: 'var(--color-primary-light)', color: 'var(--color-primary)' };
      case 'Aplicativo':
        return { bg: 'var(--color-accent-light)', color: 'var(--color-accent)' };
      case 'Frota':
        return { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)' };
      default:
        return { bg: 'var(--color-info-bg)', color: 'var(--color-info)' };
    }
  };

  const tipoColor = getTipoColor();
  const usoColor = getUsoColor();

  return (
    <Card
      elevation={0}
      className="transition-all duration-200 hover:shadow-lg"
      sx={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid',
        borderColor: 'var(--border-default)',
        '&:hover': {
          borderColor: 'var(--color-primary)',
        },
      }}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: tipoColor.color,
                fontSize: '1.125rem',
                fontWeight: 600,
              }}
            >
              {getTipoIcon()}
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-lg mb-1 truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {veiculo.marca} {veiculo.modelo}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Chip
                  label={veiculo.tipo_veiculo}
                  size="small"
                  sx={{
                    backgroundColor: tipoColor.bg,
                    color: tipoColor.color,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    height: '24px',
                  }}
                />
                <Chip
                  icon={<WorkIcon sx={{ fontSize: 14 }} />}
                  label={veiculo.uso_veiculo}
                  size="small"
                  sx={{
                    backgroundColor: usoColor.bg,
                    color: usoColor.color,
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    height: '24px',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {onEdit && (
              <Tooltip title="Editar">
                <IconButton
                  size="small"
                  onClick={() => onEdit(veiculo)}
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
              sx={{
                color: 'var(--text-secondary)',
                ml: 1,
              }}
            >
              {expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </IconButton>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="flex flex-col">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Placa
            </span>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {veiculo.placa}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Ano
            </span>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {veiculo.ano_fabricacao}/{veiculo.ano_modelo}
            </span>
          </div>
        </div>

        {/* Expandable Details */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box
            sx={{
              mt: 3,
              pt: 3,
              borderTop: '1px solid',
              borderColor: 'var(--border-default)',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cor */}
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--color-accent-light)' }}
                >
                  <ColorIcon sx={{ fontSize: 20, color: 'var(--color-accent)' }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    Cor
                  </p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {veiculo.cor}
                  </p>
                </div>
              </div>

              {/* Combustível */}
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--color-warning-bg)' }}
                >
                  <FuelIcon sx={{ fontSize: 20, color: 'var(--color-warning)' }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    Combustível
                  </p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {veiculo.combustivel}
                  </p>
                </div>
              </div>

              {/* Renavam */}
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--color-info-bg)' }}
                >
                  <CalendarIcon sx={{ fontSize: 20, color: 'var(--color-info)' }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    Renavam
                  </p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {veiculo.renavam}
                  </p>
                </div>
              </div>

              {/* Uso */}
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: usoColor.bg }}
                >
                  <WorkIcon sx={{ fontSize: 20, color: usoColor.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    Uso do Veículo
                  </p>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {veiculo.uso_veiculo}
                  </p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            {(veiculo.creation || veiculo.modified) && (
              <div
                className="mt-4 pt-4 border-t"
                style={{ borderColor: 'var(--border-light)' }}
              >
                <div className="flex justify-between items-center text-xs" style={{ color: 'var(--text-muted)' }}>
                  {veiculo.creation && <span>Cadastrado em: {formatDate(veiculo.creation)}</span>}
                  {veiculo.modified && <span>Atualizado em: {formatDate(veiculo.modified)}</span>}
                </div>
              </div>
            )}
          </Box>
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
            Tem certeza que deseja excluir o veículo{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {veiculo.marca} {veiculo.modelo}
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
