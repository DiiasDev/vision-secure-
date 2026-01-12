import { useState, useEffect, useCallback } from 'react';
import {
  CircularProgress,
  Pagination,
  Box,
  Alert,
  Button,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { getSeguros } from '../../Services/Seguros';
import type { seguro } from '../../Types/seguros.types';
import { SegurosTable } from './SegurosTable';
import { SegurosFilter } from './SegurosFilter';

interface ListaSegurosProps {
  onEdit?: (seguro: seguro) => void;
}

export default function ListaSeguros({ onEdit }: ListaSegurosProps = {}) {
  const [seguros, setSeguros] = useState<seguro[]>([]);
  const [filteredSeguros, setFilteredSeguros] = useState<seguro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tipoFilter, setTipoFilter] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const loadSeguros = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSeguros();
      console.log("seguros: ", data);
      setSeguros(data);
      setFilteredSeguros(data);
    } catch (err: any) {
      console.error('Erro ao carregar seguros:', err);
      setError('Não foi possível carregar os seguros. Tente novamente.');
      setSeguros([]);
      setFilteredSeguros([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeguros();
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...seguros];

    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (seguro) => {
          // Busca por apólice
          if (seguro.numero_apolice && seguro.numero_apolice.toLowerCase().includes(term)) return true;
          
          // Busca por nome do segurado (enriquecido)
          if (seguro.segurado_nome && seguro.segurado_nome.toLowerCase().includes(term)) return true;
          
          // Busca por ID do segurado
          if (seguro.segurado && seguro.segurado.toLowerCase().includes(term)) return true;
          
          // Busca por CPF do segurado (apenas números)
          if (seguro.segurado_cpf && seguro.segurado_cpf.trim() !== '') {
            const cpfNumbers = seguro.segurado_cpf.replace(/\D/g, '');
            const searchNumbers = term.replace(/\D/g, '');
            if (searchNumbers && cpfNumbers.includes(searchNumbers)) return true;
          }
          
          // Busca por telefone do segurado (apenas números)
          if (seguro.segurado_telefone && seguro.segurado_telefone.trim() !== '') {
            const phoneNumbers = seguro.segurado_telefone.replace(/\D/g, '');
            const searchNumbers = term.replace(/\D/g, '');
            if (searchNumbers && phoneNumbers.includes(searchNumbers)) return true;
          }
          
          // Busca por nome da seguradora (enriquecido)
          if (seguro.seguradora_nome && seguro.seguradora_nome.toLowerCase().includes(term)) return true;
          
          // Busca por ID da seguradora
          if (seguro.seguradora && seguro.seguradora.toLowerCase().includes(term)) return true;
          
          // Busca por nome do corretor (enriquecido)
          if (seguro.corretor_nome && seguro.corretor_nome.toLowerCase().includes(term)) return true;
          
          // Busca por ID do corretor
          if (seguro.corretor_responsavel && seguro.corretor_responsavel.toLowerCase().includes(term)) return true;
          
          // Busca por placa do veículo
          if (seguro.veiculo_placa && seguro.veiculo_placa.toLowerCase().includes(term)) return true;
          
          // Busca por marca do veículo
          if (seguro.veiculo_marca && seguro.veiculo_marca.toLowerCase().includes(term)) return true;
          
          // Busca por modelo do veículo
          if (seguro.veiculo_modelo && seguro.veiculo_modelo.toLowerCase().includes(term)) return true;
          
          return false;
        }
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((seguro) => seguro.status_segurado === statusFilter);
    }

    if (tipoFilter !== 'all') {
      filtered = filtered.filter((seguro) => seguro.tipo_seguro === tipoFilter);
    }

    setFilteredSeguros(filtered);
    setPage(1);
  }, [seguros, searchTerm, statusFilter, tipoFilter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handlePageChange = (_event: unknown, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginatedSeguros = filteredSeguros.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSeguros.length / itemsPerPage);

  const stats = {
    total: seguros.length,
    ativos: seguros.filter((s) => s.status_segurado === 'Ativo').length,
    vencidos: seguros.filter((s) => s.status_segurado === 'Vencido').length,
    pagamentosPendentes: seguros.filter(
      (s) => s.situacao_pagamento === 'Pendente' || s.situacao_pagamento === 'Atrasado'
    ).length,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Seguros
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Gerencie todas as apólices de seguros cadastradas no sistema
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadSeguros}
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
              Total de Seguros
            </p>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {stats.total}
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
              Seguros Ativos
            </p>
            <p className="text-2xl font-bold" style={{ color: '#4caf50' }}>
              {stats.ativos}
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
              Seguros Vencidos
            </p>
            <p className="text-2xl font-bold" style={{ color: '#f44336' }}>
              {stats.vencidos}
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
              Pagamentos Pendentes
            </p>
            <p className="text-2xl font-bold" style={{ color: '#ff9800' }}>
              {stats.pagamentosPendentes}
            </p>
          </div>
        </div>

        {/* Filters */}
        <SegurosFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          tipoFilter={tipoFilter}
          onTipoChange={setTipoFilter}
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
            <Button color="inherit" size="small" onClick={loadSeguros}>
              Tentar Novamente
            </Button>
          }
          sx={{ mb: 4 }}
        >
          {error}
        </Alert>
      ) : filteredSeguros.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          {seguros.length === 0
            ? 'Nenhum seguro cadastrado no sistema.'
            : 'Nenhum seguro encontrado com os filtros aplicados.'}
        </Alert>
      ) : (
        <>
          {/* Table View */}
          <SegurosTable seguros={paginatedSeguros} onEdit={onEdit} onDelete={loadSeguros} />

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