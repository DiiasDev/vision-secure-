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
import { getCorretor } from '../../Services/corretores';
import type { corretor } from '../../Types/corretores.types';
import { CorretorCard } from './CorretorCard';
import { CorretoresTable } from './CorretoresTable';
import { CorretoresFilter } from './CorretoresFilter';

interface ListaCorretoresProps {
  onEdit?: (corretor: corretor) => void;
}

export default function ListaCorretores({ onEdit }: ListaCorretoresProps = {}) {
  const [corretores, setCorretores] = useState<corretor[]>([]);
  const [filteredCorretores, setFilteredCorretores] = useState<corretor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPrincipal, setFilterPrincipal] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const loadCorretores = async () => {
    try {
      setLoading(true);
      setError(null);
      const corretores = await getCorretor();
      console.log('corretores: ', corretores);
      setCorretores(corretores);
      setFilteredCorretores(corretores);
    } catch (err: any) {
      console.error('Erro ao carregar corretores:', err);
      setError('Não foi possível carregar os corretores. Tente novamente.');
      setCorretores([]);
      setFilteredCorretores([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCorretores();
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = corretores;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((c) => c.status === filterStatus);
    }

    // Filter by principal
    if (filterPrincipal !== 'all') {
      filtered = filtered.filter((c) => c.corretor_principal === Number(filterPrincipal));
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.nome_completo.toLowerCase().includes(term) ||
          c.cpf.toLowerCase().includes(term) ||
          c.telefone.toLowerCase().includes(term) ||
          c.email_principal.toLowerCase().includes(term) ||
          c.cidade?.toLowerCase().includes(term) ||
          c.cargo?.toLowerCase().includes(term)
      );
    }

    setFilteredCorretores(filtered);
    setPage(1); // Reset to first page when filters change
  }, [searchTerm, filterStatus, filterPrincipal, corretores]);

  // Pagination
  const totalPages = Math.ceil(filteredCorretores.length / itemsPerPage);
  const paginatedCorretores = filteredCorretores.slice(
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
              Corretores
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Gerencie todos os corretores cadastrados no sistema
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
              onClick={loadCorretores}
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
              Total de Corretores
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {corretores.length}
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
              Ativos
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-success)' }}>
              {corretores.filter((c) => c.status === 'Ativo').length}
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
              Principais
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-warning)' }}>
              {corretores.filter((c) => c.corretor_principal === 1).length}
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
              Inativos
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-error)' }}>
              {corretores.filter((c) => c.status === 'Inativo').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <CorretoresFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          filterPrincipal={filterPrincipal}
          onFilterPrincipalChange={setFilterPrincipal}
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
            <Button color="inherit" size="small" onClick={loadCorretores}>
              Tentar Novamente
            </Button>
          }
          sx={{ mb: 4 }}
        >
          {error}
        </Alert>
      ) : filteredCorretores.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          {corretores.length === 0
            ? 'Nenhum corretor cadastrado no sistema.'
            : 'Nenhum corretor encontrado com os filtros aplicados.'}
        </Alert>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedCorretores.map((corretor) => (
                <CorretorCard key={corretor.name} corretor={corretor} onEdit={onEdit} onDelete={loadCorretores} />
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && <CorretoresTable corretores={paginatedCorretores} onEdit={onEdit} onDelete={loadCorretores} />}

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