import { useState } from 'react';
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
  IconButton,
  Chip,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider
} from '@mui/material';
import {
  Add,
  CheckCircle,
  Warning,
  Search,
  FilterList,
  Download,
  Receipt,
  AttachMoney,
  TrendingUp,
  CalendarMonth
} from '@mui/icons-material';
import DateRangeFilter from '../../Components/GestãoFinanceira/DateRangeFilter';

interface Transacao {
  id: number;
  data: string;
  tipo: 'comissao' | 'premio' | 'ajuste' | 'estorno';
  corretor: string;
  apolice: string;
  valor: number;
  status: 'pendente' | 'conciliado' | 'divergente';
  observacao?: string;
}

const transacoesIniciais: Transacao[] = [
  { id: 1, data: '15/01/2026', tipo: 'comissao', corretor: 'Carlos Silva', apolice: 'APO-2024-001', valor: 2500.00, status: 'conciliado' },
  { id: 2, data: '16/01/2026', tipo: 'premio', corretor: 'Ana Santos', apolice: 'APO-2024-002', valor: 15000.00, status: 'conciliado' },
  { id: 3, data: '17/01/2026', tipo: 'comissao', corretor: 'Roberto Lima', apolice: 'APO-2024-003', valor: 1800.00, status: 'pendente' },
  { id: 4, data: '18/01/2026', tipo: 'ajuste', corretor: 'Mariana Costa', apolice: 'APO-2024-004', valor: -300.00, status: 'divergente', observacao: 'Valor incorreto no sistema' },
  { id: 5, data: '19/01/2026', tipo: 'comissao', corretor: 'Pedro Oliveira', apolice: 'APO-2024-005', valor: 2200.00, status: 'conciliado' },
  { id: 6, data: '20/01/2026', tipo: 'estorno', corretor: 'Julia Ferreira', apolice: 'APO-2024-006', valor: -1500.00, status: 'pendente' },
  { id: 7, data: '21/01/2026', tipo: 'comissao', corretor: 'Lucas Almeida', apolice: 'APO-2024-007', valor: 1950.00, status: 'conciliado' },
  { id: 8, data: '22/01/2026', tipo: 'premio', corretor: 'Beatriz Souza', apolice: 'APO-2024-008', valor: 12500.00, status: 'pendente' },
];

export default function Acerto() {
  const [transacoes, setTransacoes] = useState<Transacao[]>(transacoesIniciais);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTransacao, setSelectedTransacao] = useState<Transacao | null>(null);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getTipoLabel = (tipo: string) => {
    const tipos: { [key: string]: string } = {
      comissao: 'Comissão',
      premio: 'Prêmio',
      ajuste: 'Ajuste',
      estorno: 'Estorno'
    };
    return tipos[tipo] || tipo;
  };

  const getTipoColor = (tipo: string) => {
    const colors: { [key: string]: string } = {
      comissao: 'var(--color-primary)',
      premio: 'var(--color-success)',
      ajuste: 'var(--color-warning)',
      estorno: 'var(--color-danger)'
    };
    return colors[tipo] || 'var(--text-secondary)';
  };

  const getStatusChip = (status: string) => {
    const statusConfig: { [key: string]: { label: string; color: string; bg: string } } = {
      pendente: { label: 'Pendente', color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' },
      conciliado: { label: 'Conciliado', color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
      divergente: { label: 'Divergente', color: 'var(--color-danger)', bg: 'var(--color-danger-bg)' }
    };
    const config = statusConfig[status] || statusConfig.pendente;
    return (
      <Chip
        label={config.label}
        size="small"
        sx={{
          backgroundColor: config.bg,
          color: config.color,
          fontWeight: 600,
          fontSize: '0.75rem'
        }}
      />
    );
  };

  const handleConciliar = (id: number) => {
    setTransacoes(transacoes.map(t =>
      t.id === id ? { ...t, status: 'conciliado' as const } : t
    ));
  };

  const handleOpenDetails = (transacao: Transacao) => {
    setSelectedTransacao(transacao);
    setOpenDialog(true);
  };

  // Filtrar transações
  const filteredTransacoes = transacoes.filter(t => {
    const matchSearch = t.corretor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       t.apolice.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'todos' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Estatísticas
  const totalTransacoes = transacoes.length;
  const totalConciliado = transacoes.filter(t => t.status === 'conciliado').reduce((acc, t) => acc + t.valor, 0);
  const totalPendente = transacoes.filter(t => t.status === 'pendente').reduce((acc, t) => acc + t.valor, 0);
  const totalDivergente = transacoes.filter(t => t.status === 'divergente').length;

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
          Gerencie pagamentos, comissões e ajustes financeiros
        </Typography>
      </Box>

      {/* Cards de Resumo */}
      <Box className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Box className="flex items-center justify-between mb-2">
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Total de Transações
              </Typography>
              <Receipt sx={{ color: 'var(--color-primary)', fontSize: 24 }} />
            </Box>
            <Typography variant="h4" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              {totalTransacoes}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Box className="flex items-center justify-between mb-2">
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Valor Conciliado
              </Typography>
              <CheckCircle sx={{ color: 'var(--color-success)', fontSize: 24 }} />
            </Box>
            <Typography variant="h5" sx={{ color: 'var(--color-success)', fontWeight: 700 }}>
              R$ {totalConciliado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Box className="flex items-center justify-between mb-2">
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Valor Pendente
              </Typography>
              <CalendarMonth sx={{ color: 'var(--color-warning)', fontSize: 24 }} />
            </Box>
            <Typography variant="h5" sx={{ color: 'var(--color-warning)', fontWeight: 700 }}>
              R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Box className="flex items-center justify-between mb-2">
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Divergências
              </Typography>
              <Warning sx={{ color: 'var(--color-danger)', fontSize: 24 }} />
            </Box>
            <Typography variant="h4" sx={{ color: 'var(--color-danger)', fontWeight: 700 }}>
              {totalDivergente}
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
                placeholder="Buscar por corretor ou apólice..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ color: 'var(--text-tertiary)', mr: 1, fontSize: 20 }} />
                }}
                sx={{
                  minWidth: 300,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--input-bg)',
                    '& fieldset': { borderColor: 'var(--input-border)' },
                  },
                  '& .MuiInputBase-input': { color: 'var(--text-primary)' }
                }}
              />

              <TextField
                select
                size="small"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{
                  minWidth: 150,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--input-bg)',
                    '& fieldset': { borderColor: 'var(--input-border)' },
                  },
                  '& .MuiInputBase-input': { color: 'var(--text-primary)' }
                }}
              >
                <MenuItem value="todos">Todos Status</MenuItem>
                <MenuItem value="pendente">Pendente</MenuItem>
                <MenuItem value="conciliado">Conciliado</MenuItem>
                <MenuItem value="divergente">Divergente</MenuItem>
              </TextField>

              <DateRangeFilter />
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
              <Button
                variant="contained"
                startIcon={<Add />}
                sx={{
                  backgroundColor: 'var(--color-primary)',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-hover)',
                  }
                }}
              >
                Nova Transação
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'var(--border-default)' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              px: 2,
              '& .MuiTab-root': {
                color: 'var(--text-secondary)',
                textTransform: 'none',
                fontWeight: 500,
                '&.Mui-selected': {
                  color: 'var(--color-primary)',
                  fontWeight: 600
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'var(--color-primary)'
              }
            }}
          >
            <Tab label="Todas Transações" />
            <Tab label="Pendentes de Conciliação" />
            <Tab label="Divergências" />
          </Tabs>
        </Box>

        <CardContent>
          {/* Tabela de Transações */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'var(--bg-table-header)' }}>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Data</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Tipo</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Corretor</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Apólice</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Valor</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransacoes
                  .filter(t => {
                    if (tabValue === 1) return t.status === 'pendente';
                    if (tabValue === 2) return t.status === 'divergente';
                    return true;
                  })
                  .map((transacao) => (
                    <TableRow
                      key={transacao.id}
                      sx={{
                        '&:hover': { backgroundColor: 'var(--bg-table-row-hover)' },
                        cursor: 'pointer'
                      }}
                      onClick={() => handleOpenDetails(transacao)}
                    >
                      <TableCell sx={{ color: 'var(--text-secondary)' }}>
                        {transacao.data}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getTipoLabel(transacao.tipo)}
                          size="small"
                          sx={{
                            backgroundColor: `${getTipoColor(transacao.tipo)}20`,
                            color: getTipoColor(transacao.tipo),
                            fontWeight: 600,
                            fontSize: '0.75rem'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {transacao.corretor}
                      </TableCell>
                      <TableCell sx={{ color: 'var(--text-secondary)' }}>
                        {transacao.apolice}
                      </TableCell>
                      <TableCell sx={{ 
                        color: transacao.valor >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
                        fontWeight: 600
                      }}>
                        R$ {Math.abs(transacao.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        {getStatusChip(transacao.status)}
                      </TableCell>
                      <TableCell>
                        {transacao.status === 'pendente' && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleConciliar(transacao.id);
                            }}
                            sx={{
                              backgroundColor: 'var(--color-success)',
                              textTransform: 'none',
                              fontSize: '0.75rem',
                              '&:hover': {
                                backgroundColor: 'var(--color-success)',
                                opacity: 0.9
                              }
                            }}
                          >
                            Conciliar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'var(--bg-card)',
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          Detalhes da Transação
        </DialogTitle>
        <DialogContent>
          {selectedTransacao && (
            <Box className="space-y-4 mt-2">
              <Box className="grid grid-cols-2 gap-4">
                <Box>
                  <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                    Data
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {selectedTransacao.data}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                    Tipo
                  </Typography>
                  <Box className="mt-1">
                    <Chip
                      label={getTipoLabel(selectedTransacao.tipo)}
                      size="small"
                      sx={{
                        backgroundColor: `${getTipoColor(selectedTransacao.tipo)}20`,
                        color: getTipoColor(selectedTransacao.tipo),
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ borderColor: 'var(--border-default)' }} />

              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                  Corretor
                </Typography>
                <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  {selectedTransacao.corretor}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                  Apólice
                </Typography>
                <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  {selectedTransacao.apolice}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                  Valor
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: selectedTransacao.valor >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
                    fontWeight: 700
                  }}
                >
                  R$ {Math.abs(selectedTransacao.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                  Status
                </Typography>
                <Box className="mt-1">
                  {getStatusChip(selectedTransacao.status)}
                </Box>
              </Box>

              {selectedTransacao.observacao && (
                <>
                  <Divider sx={{ borderColor: 'var(--border-default)' }} />
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Observação:
                    </Typography>
                    <Typography variant="body2">
                      {selectedTransacao.observacao}
                    </Typography>
                  </Alert>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              color: 'var(--text-secondary)',
              textTransform: 'none'
            }}
          >
            Fechar
          </Button>
          {selectedTransacao?.status === 'pendente' && (
            <Button
              onClick={() => {
                handleConciliar(selectedTransacao.id);
                setOpenDialog(false);
              }}
              variant="contained"
              sx={{
                backgroundColor: 'var(--color-success)',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'var(--color-success)',
                  opacity: 0.9
                }
              }}
            >
              Conciliar Transação
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
