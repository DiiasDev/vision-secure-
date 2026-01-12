import { useState, useEffect } from 'react';
import {
  CircularProgress,
  Pagination,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Alert,
  Button,
} from '@mui/material';
import {
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { getVehicle } from '../../Services/veiculos';
import type { veiculo } from '../../Types/veiculos.types';
import { VeiculoCard } from './VeiculoCard';
import { VeiculosTable } from './VeiculosTable';
import { VeiculosFilter } from './VeiculosFilter';

interface ListaVeiculosProps {
  onEdit?: (veiculo: veiculo) => void;
}

export default function ListaVeiculos({ onEdit }: ListaVeiculosProps = {}) {
  const [veiculos, setVeiculos] = useState<veiculo[]>([]);
  const [filteredVeiculos, setFilteredVeiculos] = useState<veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('all');
  const [filterUso, setFilterUso] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const loadVehicles = async () => {
    try {
      setLoading(true);
      setError(null);
      const veiculos = await getVehicle();
      console.log('veiculos: ', veiculos);
      setVeiculos(veiculos);
      setFilteredVeiculos(veiculos);
    } catch (err: any) {
      console.error('Erro ao carregar veículos:', err);
      setError('Não foi possível carregar os veículos. Tente novamente.');
      setVeiculos([]);
      setFilteredVeiculos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = veiculos;

    // Filter by tipo
    if (filterTipo !== 'all') {
      filtered = filtered.filter((v) => v.tipo_veiculo === filterTipo);
    }

    // Filter by uso
    if (filterUso !== 'all') {
      filtered = filtered.filter((v) => v.uso_veiculo === filterUso);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.marca.toLowerCase().includes(term) ||
          v.modelo.toLowerCase().includes(term) ||
          v.placa.toLowerCase().includes(term) ||
          v.renavam.toLowerCase().includes(term) ||
          v.cor.toLowerCase().includes(term)
      );
    }

    setFilteredVeiculos(filtered);
    setPage(1); // Reset to first page when filters change
  }, [searchTerm, filterTipo, filterUso, veiculos]);

  // Pagination
  const totalPages = Math.ceil(filteredVeiculos.length / itemsPerPage);
  const paginatedVeiculos = filteredVeiculos.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (_event: unknown, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Veículos
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Gerencie todos os veículos cadastrados no sistema
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_e, newMode) => newMode && setViewMode(newMode)}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  color: 'var(--text-secondary)',
                  borderColor: 'var(--border-default)',
                  '&.Mui-selected': {
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'var(--color-primary-hover)',
                    },
                  },
                },
              }}
            >
              <ToggleButton value="grid" aria-label="grid view">
                <ViewModuleIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value="table" aria-label="table view">
                <ViewListIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Refresh Button */}
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadVehicles}
              disabled={loading}
              sx={{
                borderColor: 'var(--border-default)',
                color: 'var(--text-primary)',
                '&:hover': {
                  borderColor: 'var(--color-primary)',
                  backgroundColor: 'var(--color-primary-light)',
                },
              }}
            >
              Atualizar
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Total de Veículos
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {veiculos.length}
            </p>
          </div>
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Carros
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {veiculos.filter((v) => v.tipo_veiculo === 'Carro').length}
            </p>
          </div>
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Motos
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>
              {veiculos.filter((v) => v.tipo_veiculo === 'Moto').length}
            </p>
          </div>
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Uso Particular
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>
              {veiculos.filter((v) => v.uso_veiculo === 'Particular').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <VeiculosFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterTipo={filterTipo}
          onFilterTipoChange={setFilterTipo}
          filterUso={filterUso}
          onFilterUsoChange={setFilterUso}
        />
      </div>

      {/* Content */}
      {loading ? (
        <Box className="flex justify-center items-center py-20">
          <CircularProgress sx={{ color: 'var(--color-primary)' }} />
        </Box>
      ) : error ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadVehicles}>
              Tentar Novamente
            </Button>
          }
          sx={{ mb: 4 }}
        >
          {error}
        </Alert>
      ) : filteredVeiculos.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          {veiculos.length === 0
            ? 'Nenhum veículo cadastrado no sistema.'
            : 'Nenhum veículo encontrado com os filtros aplicados.'}
        </Alert>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedVeiculos.map((veiculo) => (
                <VeiculoCard key={veiculo.name} veiculo={veiculo} onEdit={onEdit} onDelete={loadVehicles} />
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && <VeiculosTable veiculos={paginatedVeiculos} onEdit={onEdit} onDelete={loadVehicles} />}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                  },
                  '& .Mui-selected': {
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'var(--color-primary-hover)',
                    },
                  },
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}