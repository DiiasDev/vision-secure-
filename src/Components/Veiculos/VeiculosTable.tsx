import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  TwoWheeler as MotoIcon,
  LocalShipping as TruckIcon,
  WorkOutline as WorkIcon,
} from '@mui/icons-material';
import type { veiculo } from '../../Types/veiculos.types';
import { formatDate } from '../../Utils/Formatter';
import { getInitials } from '../../Utils/StringHelpers';

interface VeiculosTableProps {
  veiculos: veiculo[];
}

export function VeiculosTable({ veiculos }: VeiculosTableProps) {
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Carro':
      case 'Utilitário':
        return <CarIcon sx={{ fontSize: 16 }} />;
      case 'Moto':
        return <MotoIcon sx={{ fontSize: 16 }} />;
      case 'Caminhão':
        return <TruckIcon sx={{ fontSize: 16 }} />;
      default:
        return <CarIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
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

  const getUsoColor = (uso: string) => {
    switch (uso) {
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

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      className="rounded-lg"
      sx={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid',
        borderColor: 'var(--border-default)',
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: 'var(--bg-table-header)',
            }}
          >
            <TableCell sx={{ py: 2 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Veículo
              </span>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Tipo
              </span>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Placa
              </span>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Ano
              </span>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Cor
              </span>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Combustível
              </span>
            </TableCell>
            <TableCell sx={{ py: 2 }}>
              <span
                className="font-semibold text-xs uppercase tracking-wide"
                style={{ color: 'var(--text-secondary)' }}
              >
                Uso
              </span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {veiculos.map((veiculo) => {
            const tipoColor = getTipoColor(veiculo.tipo_veiculo);
            const usoColor = getUsoColor(veiculo.uso_veiculo);
            return (
              <TableRow
                key={veiculo.name}
                sx={{
                  backgroundColor: 'var(--bg-table-row)',
                  '&:hover': {
                    backgroundColor: 'var(--bg-table-row-hover)',
                  },
                  transition: 'background-color 0.2s',
                }}
              >
                {/* Marca e Modelo */}
                <TableCell sx={{ py: 2 }}>
                  <div className="flex items-center gap-3">
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: tipoColor.color,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }}
                    >
                      {getTipoIcon(veiculo.tipo_veiculo)}
                    </Avatar>
                    <div>
                      <p
                        className="font-semibold text-sm"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {veiculo.marca} {veiculo.modelo}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        ID: {veiculo.name}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Tipo */}
                <TableCell sx={{ py: 2 }}>
                  <Chip
                    {...(getTipoIcon(veiculo.tipo_veiculo) && { icon: getTipoIcon(veiculo.tipo_veiculo) })}
                    label={veiculo.tipo_veiculo}
                    size="small"
                    sx={{
                      backgroundColor: tipoColor.bg,
                      color: tipoColor.color,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </TableCell>

                {/* Placa */}
                <TableCell sx={{ py: 2 }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    {veiculo.placa}
                  </span>
                </TableCell>

                {/* Ano */}
                <TableCell sx={{ py: 2 }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {veiculo.ano_fabricacao}/{veiculo.ano_modelo}
                  </span>
                </TableCell>

                {/* Cor */}
                <TableCell sx={{ py: 2 }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {veiculo.cor}
                  </span>
                </TableCell>

                {/* Combustível */}
                <TableCell sx={{ py: 2 }}>
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {veiculo.combustivel}
                  </span>
                </TableCell>

                {/* Uso */}
                <TableCell sx={{ py: 2 }}>
                  <Chip
                    icon={<WorkIcon sx={{ fontSize: 14 }} />}
                    label={veiculo.uso_veiculo}
                    size="small"
                    sx={{
                      backgroundColor: usoColor.bg,
                      color: usoColor.color,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
