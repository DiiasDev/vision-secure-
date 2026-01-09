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
import { getSegurados } from '../../Services/Segurados';
import type { segurado } from '../../Types/segurados.types';
import { SeguradoCard } from './SeguradoCard';
import { SeguradosTable } from './SeguradosTable';
import { SeguradosFilter } from './SeguradosFilter';

export default function ListarSegurados() {
  const [segurados, setSegurados] = useState<segurado[]>([]);
  const [filteredSegurados, setFilteredSegurados] = useState<segurado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const loadSegurados = async () => {
    try {
      setLoading(true);
      setError(null);
      const segurados = await getSegurados();
      console.log("segurados: ", segurados)
      setSegurados(segurados);
      setFilteredSegurados(segurados);
    } catch (err: any) {
      console.error('Erro ao carregar segurados:', err);
      setError('Não foi possível carregar os segurados. Tente novamente.');
      setSegurados([]);
      setFilteredSegurados([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSegurados();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = segurados;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter((s) => s.tipo_pessoa === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.nome_completo.toLowerCase().includes(term) ||
          s.cpf.toLowerCase().includes(term) ||
          s.telefone.toLowerCase().includes(term) ||
          s.email?.toLowerCase().includes(term) ||
          s.whatsapp?.toLowerCase().includes(term)
      );
    }

    setFilteredSegurados(filtered);
    setPage(1); // Reset to first page when filters change
  }, [searchTerm, filterType, segurados]);

  // Pagination
  const totalPages = Math.ceil(filteredSegurados.length / itemsPerPage);
  const paginatedSegurados = filteredSegurados.slice(
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
              Segurados
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Gerencie todos os segurados cadastrados no sistema
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
              onClick={loadSegurados}
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
              Total de Segurados
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {segurados.length}
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
              Pessoas Físicas
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {segurados.filter((s) => s.tipo_pessoa === 'Física').length}
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
              Pessoas Jurídicas
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {segurados.filter((s) => s.tipo_pessoa === 'Jurídica').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <SeguradosFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterType={filterType}
          onFilterTypeChange={setFilterType}
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
            <Button color="inherit" size="small" onClick={loadSegurados}>
              Tentar Novamente
            </Button>
          }
          sx={{ mb: 4 }}
        >
          {error}
        </Alert>
      ) : filteredSegurados.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          {segurados.length === 0
            ? 'Nenhum segurado cadastrado no sistema.'
            : 'Nenhum segurado encontrado com os filtros aplicados.'}
        </Alert>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedSegurados.map((segurado) => (
                <SeguradoCard key={segurado.name} segurado={segurado} />
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && <SeguradosTable segurados={paginatedSegurados} />}

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