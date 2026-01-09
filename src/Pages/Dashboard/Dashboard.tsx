import { useState, useEffect } from 'react';
import './Dashboard.css';
import { StatCard, FilterBar } from '../../Components/Dashboards';
import { SegurosTable } from '../../Components/Seguros/SegurosTable';
import { getSeguros } from '../../Services/Seguros';
import type { seguro } from '../../Types/seguros.types';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { CircularProgress, Box, Alert } from '@mui/material';

export default function Dashboard() {
  const [seguros, setSeguros] = useState<seguro[]>([]);
  const [filteredSeguros, setFilteredSeguros] = useState<seguro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'expiring'>('all');
  const itemsPerPage = 10;

  useEffect(() => {
    loadSeguros();
  }, []);

  const loadSeguros = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSeguros();
      setSeguros(data);
      applyFilter(data, filter);
    } catch (err: any) {
      console.error('Erro ao carregar seguros:', err);
      setError('Não foi possível carregar os seguros.');
      setSeguros([]);
      setFilteredSeguros([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (data: seguro[], currentFilter: 'all' | 'expiring') => {
    if (currentFilter === 'expiring') {
      const filtered = data.filter(seguro => 
        seguro.situacao_pagamento !== 'Pago' || 
        seguro.status_segurado === 'Vencido'
      );
      setFilteredSeguros(filtered);
    } else {
      setFilteredSeguros(data);
    }
  };

  const handlePageChange = (_event: unknown, value: number) => {
    setPage(value);
  };

  const handleFilterChange = (newFilter: 'all' | 'expiring') => {
    setFilter(newFilter);
    setPage(1);
    applyFilter(seguros, newFilter);
  };

  const paginatedData = filteredSeguros.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Calcular estatísticas baseadas em dados reais
  const calcularDiasAteVencimento = (fimVigencia: string): number => {
    const hoje = new Date();
    const vencimento = new Date(fimVigencia);
    hoje.setHours(0, 0, 0, 0);
    vencimento.setHours(0, 0, 0, 0);
    const diffTime = vencimento.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const expiring30Days = seguros.filter(seguro => {
    const dias = calcularDiasAteVencimento(seguro.fim_vigencia);
    return dias <= 30 && dias > 15 && seguro.situacao_pagamento !== 'Pago';
  }).length;

  const expiring15Days = seguros.filter(seguro => {
    const dias = calcularDiasAteVencimento(seguro.fim_vigencia);
    return dias <= 15 && dias > 5 && seguro.situacao_pagamento !== 'Pago';
  }).length;

  const expiring5Days = seguros.filter(seguro => {
    const dias = calcularDiasAteVencimento(seguro.fim_vigencia);
    return dias <= 5 && dias >= 0 && seguro.situacao_pagamento !== 'Pago';
  }).length;

  return (
    <div className="min-h-screen p-8 pb-24" style={{ backgroundColor: 'var(--bg-app)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          Olá, Valdir! Confira os vencimentos próximos:
        </h1>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            count={expiring30Days}
            label="Seguros Vencem em 30 Dias"
            color="orange"
            IconComponent={CalendarMonthIcon}
          />
          <StatCard
            count={expiring15Days}
            label="Vencem em 15 Dias"
            color="amber"
            IconComponent={AccessTimeIcon}
          />
          <StatCard
            count={expiring5Days}
            label="Vence em 5 Dias"
            color="red"
            IconComponent={NotificationsActiveIcon}
          />
        </div>
      </div>

      {/* Table Section */}
      <div
        className="rounded-lg p-6"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
          borderWidth: '1px',
          borderStyle: 'solid',
        }}
      >
        <div className="flex justify-between items-center mb-5">
          <h2
            className="text-lg font-semibold flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <AssignmentIcon sx={{ fontSize: 24, color: 'var(--color-primary)' }} />
            Lista de Seguros
          </h2>
          <FilterBar filter={filter} onFilterChange={handleFilterChange} />
        </div>

        {loading ? (
          <Box className="flex justify-center items-center py-20">
            <CircularProgress sx={{ color: 'var(--color-primary)' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        ) : filteredSeguros.length === 0 ? (
          <Alert severity="info" sx={{ mb: 4 }}>
            {seguros.length === 0
              ? 'Nenhum seguro cadastrado no sistema.'
              : 'Nenhum seguro encontrado com os filtros aplicados.'}
          </Alert>
        ) : (
          <SegurosTable seguros={paginatedData} />
        )}
      </div>
    </div>
  );
}