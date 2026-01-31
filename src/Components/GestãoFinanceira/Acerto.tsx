import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import {
  Download,
  InsertDriveFile,
  AttachMoney,
  ReceiptLong,
  TrendingUp
} from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import 'dayjs/locale/pt-br';
import DateRangeFilter from '../../Components/GestãoFinanceira/DateRangeFilter';
import { listarAcertos } from '../../Services/acertoService';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface PlanilhaAcertoResumo {
  id: string;
  nomeArquivo: string;
  dataCriacao: string;
  dataCriacaoRaw: string;
  total_comissoes: number;
  planilhaUrl?: string;
}

export default function Acerto() {
  const [planilhas, setPlanilhas] = useState<PlanilhaAcertoResumo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const formatDateTime = (value?: string) => {
    if (!value) return '-';
    const normalized = value.includes('T') ? value : value.replace(' ', 'T');
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) return value;
    const data = date.toLocaleDateString('pt-BR');
    if (!value.includes(':')) {
      return data;
    }
    const hora = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${data} ${hora}`;
  };

  useEffect(() => {
    let isMounted = true;

    const carregarPlanilhas = async () => {
      try {
        const response = await listarAcertos(50, 0);
        const acertos = response?.acertos ?? [];
        const dados: PlanilhaAcertoResumo[] = acertos.map((acerto) => {
          const nomeArquivo =
            (acerto.planilha_excel ? acerto.planilha_excel.split('/').pop() : '') ||
            acerto.name;

          const dataRaw = acerto.creation || acerto.data_acerto || '';
          return {
            id: acerto.name,
            nomeArquivo,
            dataCriacaoRaw: dataRaw,
            dataCriacao: formatDateTime(dataRaw),
            total_comissoes: acerto.total_comissoes ?? 0,
            planilhaUrl: acerto.planilha_excel,
          };
        });
        if (isMounted) {
          setPlanilhas(dados);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Erro ao carregar as planilhas de acerto');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    carregarPlanilhas();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPlanilhas = useMemo(() => {
    const termo = searchTerm.trim().toLowerCase();
    return planilhas.filter((planilha) => {
      const matchSearch = !termo || planilha.nomeArquivo.toLowerCase().includes(termo);

      const hasDateFilter = !!startDate && !!endDate;
      if (!hasDateFilter) return matchSearch;

      const raw = planilha.dataCriacaoRaw;
      if (!raw) return false;
      const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T');
      const dateValue = dayjs(normalized);
      if (!dateValue.isValid()) return false;

      const withinRange =
        dateValue.isSameOrAfter(startDate as Dayjs, 'day') &&
        dateValue.isSameOrBefore(endDate as Dayjs, 'day');

      return matchSearch && withinRange;
    });
  }, [planilhas, searchTerm, startDate, endDate]);

  const totalArquivos = planilhas.length;
  const totalComissoes = planilhas.reduce(
    (acc, planilha) => acc + (planilha.total_comissoes ?? 0),
    0
  );
  const maiorComissao = planilhas.reduce(
    (acc, planilha) => Math.max(acc, planilha.total_comissoes ?? 0),
    0
  );
  const comissaoMedia = totalArquivos ? totalComissoes / totalArquivos : 0;

  const handleDownloadPlanilha = (planilha: PlanilhaAcertoResumo) => {
    if (!planilha.planilhaUrl) return;
    const url = planilha.planilhaUrl.startsWith('http')
      ? planilha.planilhaUrl
      : `${window.location.origin}${planilha.planilhaUrl.startsWith('/') ? '' : '/'}${planilha.planilhaUrl}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = planilha.nomeArquivo;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box
      className="p-6 min-h-screen"
      sx={{ backgroundColor: 'var(--bg-app)' }}
    >
      {/* Header */}
      <Box className="mb-6">
        <Typography
          variant="h4"
          sx={{
            color: 'var(--text-primary)',
            fontWeight: 700,
            mb: 1
          }}
        >
          Acerto e Conciliação
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'var(--text-secondary)' }}
        >
          Arquivos de acerto gerados em Excel
        </Typography>
      </Box>

      {/* Cards de Resumo */}
      <Box className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Box className="flex items-center justify-between mb-2">
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Total de Arquivos
              </Typography>
              <InsertDriveFile sx={{ color: 'var(--color-primary)', fontSize: 24 }} />
            </Box>
            <Typography variant="h4" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              {totalArquivos}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Box className="flex items-center justify-between mb-2">
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Total de Comissões
              </Typography>
              <AttachMoney sx={{ color: 'var(--color-success)', fontSize: 24 }} />
            </Box>
            <Typography variant="h5" sx={{ color: 'var(--color-success)', fontWeight: 700 }}>
              R$ {totalComissoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Box className="flex items-center justify-between mb-2">
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Maior Comissão
              </Typography>
              <TrendingUp sx={{ color: 'var(--color-warning)', fontSize: 24 }} />
            </Box>
            <Typography variant="h5" sx={{ color: 'var(--color-warning)', fontWeight: 700 }}>
              R$ {maiorComissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Box className="flex items-center justify-between mb-2">
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Comissão Média
              </Typography>
              <ReceiptLong sx={{ color: 'var(--color-info)', fontSize: 24 }} />
            </Box>
            <Typography variant="h5" sx={{ color: 'var(--color-info)', fontWeight: 700 }}>
              R$ {comissaoMedia.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filtros e Ações */}
      <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)', mb: 3 }}>
        <CardContent>
          <Box className="flex items-center justify-between flex-wrap gap-3">
            <Box className="flex items-center gap-3 flex-wrap">
              <TextField
                placeholder="Buscar por nome do arquivo..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  minWidth: 260,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--input-bg)',
                    '& fieldset': { borderColor: 'var(--input-border)' },
                  },
                  '& .MuiInputBase-input': { color: 'var(--text-primary)' }
                }}
              />

              <DateRangeFilter
                onDateRangeChange={(inicio, fim) => {
                  setStartDate(inicio);
                  setEndDate(fim);
                }}
              />
            </Box>

            <Box className="flex items-center gap-2">
              <Button
                variant="outlined"
                startIcon={<Download />}
                sx={{
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-default)',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'var(--color-primary)',
                  }
                }}
              >
                Exportar
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabela de Planilhas */}
      <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'var(--bg-table-header)' }}>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Arquivo</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Data de Criação</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Total de Comissões</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ color: 'var(--text-secondary)' }}>
                      Carregando planilhas...
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && error && (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ color: 'var(--color-danger)' }}>
                      {error}
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !error && filteredPlanilhas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ color: 'var(--text-secondary)' }}>
                      Nenhuma planilha encontrada.
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !error && filteredPlanilhas.map((planilha) => (
                  <TableRow
                    key={planilha.id}
                    sx={{
                      '&:hover': { backgroundColor: 'var(--bg-table-row-hover)' }
                    }}
                  >
                    <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                      {planilha.nomeArquivo}
                    </TableCell>
                    <TableCell sx={{ color: 'var(--text-secondary)' }}>
                      {planilha.dataCriacao}
                    </TableCell>
                    <TableCell sx={{ color: 'var(--color-success)', fontWeight: 600 }}>
                      R$ {(planilha.total_comissoes ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<Download />}
                        onClick={() => handleDownloadPlanilha(planilha)}
                        disabled={!planilha.planilhaUrl}
                        sx={{
                          backgroundColor: 'var(--color-primary)',
                          textTransform: 'none',
                          fontSize: '0.75rem',
                          '&:hover': {
                            backgroundColor: 'var(--color-primary-hover)'
                          }
                        }}
                      >
                        Baixar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
