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
import { getSeguradoras } from '../../Services/Seguradoras';
import type { seguradora } from '../../Types/seguradoras.types';
import { SeguradoraCard } from './SeguradoraCard';
import { SeguradorasTable } from './SeguradorasTable';
import { SeguradorasFilter } from './SeguradorasFilter';

interface ListaSeguradorasProps {
  onEdit?: (seguradora: seguradora) => void;
}

export default function ListaSeguradoras({ onEdit }: ListaSeguradorasProps) {
  const [seguradoras, setSeguradoras] = useState<seguradora[]>([]);
  const [filteredSeguradoras, setFilteredSeguradoras] = useState<seguradora[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const loadSeguradoras = async () => {
    try {
      setLoading(true);
      setError(null);
      const seguradoras = await getSeguradoras();
      console.log('seguradoras: ', seguradoras);
      setSeguradoras(seguradoras);
      setFilteredSeguradoras(seguradoras);
    } catch (err: any) {
      console.error('Erro ao carregar seguradoras:', err);
      setError('Não foi possível carregar as seguradoras. Tente novamente.');
      setSeguradoras([]);
      setFilteredSeguradoras([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeguradoras();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = seguradoras;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((s) => s.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.nome_seguradora.toLowerCase().includes(term) ||
          s.codigo_interno?.toLowerCase().includes(term) ||
          s.telefone?.toLowerCase().includes(term) ||
          s.email?.toLowerCase().includes(term) ||
          s.site?.toLowerCase().includes(term)
      );
    }

    setFilteredSeguradoras(filtered);
    setPage(1); // Reset to first page when filters change
  }, [searchTerm, filterStatus, seguradoras]);

  // Pagination
  const totalPages = Math.ceil(filteredSeguradoras.length / itemsPerPage);
  const paginatedSeguradoras = filteredSeguradoras.slice(
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
              Seguradoras
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Gerencie todas as seguradoras cadastradas no sistema
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
              onClick={loadSeguradoras}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-default)',
            }}
          >
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Total de Seguradoras
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {seguradoras.length}
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
              Ativas
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>
              {seguradoras.filter((s) => s.status === 'Ativa').length}
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
              Inativas
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-error)' }}>
              {seguradoras.filter((s) => s.status === 'Inativa').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <SeguradorasFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
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
            <Button color="inherit" size="small" onClick={loadSeguradoras}>
              Tentar Novamente
            </Button>
          }
          sx={{ mb: 4 }}
        >
          {error}
        </Alert>
      ) : filteredSeguradoras.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          {seguradoras.length === 0
            ? 'Nenhuma seguradora cadastrada no sistema.'
            : 'Nenhuma seguradora encontrada com os filtros aplicados.'}
        </Alert>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedSeguradoras.map((seguradora) => (
                <SeguradoraCard 
                  key={seguradora.name} 
                  seguradora={seguradora}
                  onEdit={onEdit}
                  onDelete={loadSeguradoras}
                />
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <SeguradorasTable 
              seguradoras={paginatedSeguradoras} 
              onEdit={onEdit}
              onDelete={loadSeguradoras}
            />
          )}

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
