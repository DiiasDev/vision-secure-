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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Divider,
  Avatar
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  Download,
  AttachMoney,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Schedule,
  Search
} from '@mui/icons-material';
import DateRangeFilter from '../../Components/GestãoFinanceira/DateRangeFilter';
import CorretorFilter from '../../Components/GestãoFinanceira/CorretorFilter';

interface Comissao {
  id: number;
  corretor: string;
  apolice: string;
  segurado: string;
  seguradora: string;
  dataVenda: string;
  dataPagamento?: string;
  valorPremio: number;
  percentualComissao: number;
  valorComissao: number;
  status: 'pendente' | 'pago' | 'atrasado';
  categoria: string;
}

const comissoesIniciais: Comissao[] = [
  {
    id: 1,
    corretor: 'Carlos Silva',
    apolice: 'APO-2024-001',
    segurado: 'João Pedro Santos',
    seguradora: 'Porto Seguro',
    dataVenda: '05/01/2026',
    dataPagamento: '15/01/2026',
    valorPremio: 25000,
    percentualComissao: 10,
    valorComissao: 2500,
    status: 'pago',
    categoria: 'Auto'
  },
  {
    id: 2,
    corretor: 'Ana Santos',
    apolice: 'APO-2024-002',
    segurado: 'Maria Oliveira',
    seguradora: 'Bradesco Seguros',
    dataVenda: '08/01/2026',
    valorPremio: 18000,
    percentualComissao: 12,
    valorComissao: 2160,
    status: 'pendente',
    categoria: 'Vida'
  },
  {
    id: 3,
    corretor: 'Roberto Lima',
    apolice: 'APO-2024-003',
    segurado: 'Carlos Mendes',
    seguradora: 'Itaú Seguros',
    dataVenda: '10/01/2026',
    dataPagamento: '20/01/2026',
    valorPremio: 15000,
    percentualComissao: 8,
    valorComissao: 1200,
    status: 'pago',
    categoria: 'Residencial'
  },
  {
    id: 4,
    corretor: 'Mariana Costa',
    apolice: 'APO-2024-004',
    segurado: 'Ana Paula Lima',
    seguradora: 'SulAmérica',
    dataVenda: '12/12/2025',
    valorPremio: 22000,
    percentualComissao: 15,
    valorComissao: 3300,
    status: 'atrasado',
    categoria: 'Auto'
  },
  {
    id: 5,
    corretor: 'Pedro Oliveira',
    apolice: 'APO-2024-005',
    segurado: 'Fernando Costa',
    seguradora: 'Allianz',
    dataVenda: '15/01/2026',
    valorPremio: 30000,
    percentualComissao: 10,
    valorComissao: 3000,
    status: 'pendente',
    categoria: 'Empresarial'
  },
  {
    id: 6,
    corretor: 'Julia Ferreira',
    apolice: 'APO-2024-006',
    segurado: 'Roberto Silva',
    seguradora: 'Porto Seguro',
    dataVenda: '18/01/2026',
    dataPagamento: '22/01/2026',
    valorPremio: 12000,
    percentualComissao: 9,
    valorComissao: 1080,
    status: 'pago',
    categoria: 'Auto'
  },
  {
    id: 7,
    corretor: 'Lucas Almeida',
    apolice: 'APO-2024-007',
    segurado: 'Patricia Santos',
    seguradora: 'Bradesco Seguros',
    dataVenda: '20/01/2026',
    valorPremio: 28000,
    percentualComissao: 11,
    valorComissao: 3080,
    status: 'pendente',
    categoria: 'Vida'
  },
  {
    id: 8,
    corretor: 'Beatriz Souza',
    apolice: 'APO-2024-008',
    segurado: 'Marcos Lima',
    seguradora: 'Liberty Seguros',
    dataVenda: '10/12/2025',
    valorPremio: 35000,
    percentualComissao: 12,
    valorComissao: 4200,
    status: 'atrasado',
    categoria: 'Empresarial'
  }
];

export default function Comissoes() {
  const [comissoes, setComissoes] = useState<Comissao[]>(comissoesIniciais);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedComissao, setSelectedComissao] = useState<Comissao | null>(null);

  const getStatusChip = (status: string) => {
    const statusConfig: { [key: string]: { label: string; color: string; bg: string; icon: React.ReactElement } } = {
      pago: { 
        label: 'Pago', 
        color: 'var(--color-success)', 
        bg: 'var(--color-success-bg)',
        icon: <CheckCircle sx={{ fontSize: 16 }} />
      },
      pendente: { 
        label: 'Pendente', 
        color: 'var(--color-warning)', 
        bg: 'var(--color-warning-bg)',
        icon: <Schedule sx={{ fontSize: 16 }} />
      },
      atrasado: { 
        label: 'Atrasado', 
        color: 'var(--color-danger)', 
        bg: 'var(--color-danger-bg)',
        icon: <TrendingDown sx={{ fontSize: 16 }} />
      }
    };
    const config = statusConfig[status] || statusConfig.pendente;
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        size="small"
        sx={{
          backgroundColor: config.bg,
          color: config.color,
          fontWeight: 600,
          fontSize: '0.75rem',
          '& .MuiChip-icon': {
            color: config.color
          }
        }}
      />
    );
  };

  const handleMarcarPago = (id: number) => {
    setComissoes(comissoes.map(c =>
      c.id === id ? { 
        ...c, 
        status: 'pago' as const,
        dataPagamento: new Date().toLocaleDateString('pt-BR')
      } : c
    ));
  };

  const handleOpenDetails = (comissao: Comissao) => {
    setSelectedComissao(comissao);
    setOpenDialog(true);
  };

  // Filtrar comissões
  const filteredComissoes = comissoes.filter(c => {
    const matchSearch = c.corretor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.segurado.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       c.apolice.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'todos' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // Estatísticas
  const totalComissoes = comissoes.reduce((acc, c) => acc + c.valorComissao, 0);
  const totalPago = comissoes.filter(c => c.status === 'pago').reduce((acc, c) => acc + c.valorComissao, 0);
  const totalPendente = comissoes.filter(c => c.status === 'pendente').reduce((acc, c) => acc + c.valorComissao, 0);
  const totalAtrasado = comissoes.filter(c => c.status === 'atrasado').reduce((acc, c) => acc + c.valorComissao, 0);

  // Comissões por corretor
  const comissoesPorCorretor = comissoes.reduce((acc, c) => {
    if (!acc[c.corretor]) {
      acc[c.corretor] = { total: 0, quantidade: 0 };
    }
    acc[c.corretor].total += c.valorComissao;
    acc[c.corretor].quantidade += 1;
    return acc;
  }, {} as { [key: string]: { total: number; quantidade: number } });

  const topCorretores = Object.entries(comissoesPorCorretor)
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

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
          Gestão de Comissões
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'var(--text-secondary)' }}
        >
          Acompanhe e gerencie comissões de corretores
        </Typography>
      </Box>

      {/* Cards de Resumo */}
      <Box className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Box className="flex items-center justify-between mb-2">
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Total em Comissões
              </Typography>
              <AttachMoney sx={{ color: 'var(--color-primary)', fontSize: 24 }} />
            </Box>
            <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              R$ {totalComissoes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Box className="flex items-center justify-between mb-2">
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Pagas
              </Typography>
              <CheckCircle sx={{ color: 'var(--color-success)', fontSize: 24 }} />
            </Box>
            <Typography variant="h5" sx={{ color: 'var(--color-success)', fontWeight: 700 }}>
              R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
              {comissoes.filter(c => c.status === 'pago').length} comissões
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Box className="flex items-center justify-between mb-2">
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Pendentes
              </Typography>
              <Schedule sx={{ color: 'var(--color-warning)', fontSize: 24 }} />
            </Box>
            <Typography variant="h5" sx={{ color: 'var(--color-warning)', fontWeight: 700 }}>
              R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
              {comissoes.filter(c => c.status === 'pendente').length} comissões
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Box className="flex items-center justify-between mb-2">
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Atrasadas
              </Typography>
              <TrendingDown sx={{ color: 'var(--color-danger)', fontSize: 24 }} />
            </Box>
            <Typography variant="h5" sx={{ color: 'var(--color-danger)', fontWeight: 700 }}>
              R$ {totalAtrasado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
              {comissoes.filter(c => c.status === 'atrasado').length} comissões
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Grid Principal */}
      <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Tabela de Comissões */}
        <Box className="lg:col-span-2">
          <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <CardContent>
              <Box className="flex items-center justify-between mb-4">
                <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  Comissões Registradas
                </Typography>
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
                  Nova Comissão
                </Button>
              </Box>

              {/* Filtros */}
              <Box className="flex items-center gap-3 mb-4 flex-wrap">
                <TextField
                  placeholder="Buscar..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ color: 'var(--text-tertiary)', mr: 1, fontSize: 20 }} />
                  }}
                  sx={{
                    flex: 1,
                    minWidth: 250,
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
                    minWidth: 130,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'var(--input-bg)',
                      '& fieldset': { borderColor: 'var(--input-border)' },
                    },
                    '& .MuiInputBase-input': { color: 'var(--text-primary)' }
                  }}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="pago">Pago</MenuItem>
                  <MenuItem value="pendente">Pendente</MenuItem>
                  <MenuItem value="atrasado">Atrasado</MenuItem>
                </TextField>

                <DateRangeFilter />
                <CorretorFilter />

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

              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'var(--bg-table-header)' }}>
                      <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600, backgroundColor: 'var(--bg-table-header)' }}>Corretor</TableCell>
                      <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600, backgroundColor: 'var(--bg-table-header)' }}>Segurado</TableCell>
                      <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600, backgroundColor: 'var(--bg-table-header)' }}>Categoria</TableCell>
                      <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600, backgroundColor: 'var(--bg-table-header)' }}>Valor</TableCell>
                      <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600, backgroundColor: 'var(--bg-table-header)' }}>Status</TableCell>
                      <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600, backgroundColor: 'var(--bg-table-header)' }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredComissoes.map((comissao) => (
                      <TableRow
                        key={comissao.id}
                        sx={{
                          '&:hover': { backgroundColor: 'var(--bg-table-row-hover)' },
                          cursor: 'pointer'
                        }}
                        onClick={() => handleOpenDetails(comissao)}
                      >
                        <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                          {comissao.corretor}
                        </TableCell>
                        <TableCell sx={{ color: 'var(--text-secondary)' }}>
                          {comissao.segurado}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={comissao.categoria}
                            size="small"
                            sx={{
                              backgroundColor: 'var(--bg-hover)',
                              color: 'var(--text-primary)',
                              fontSize: '0.75rem'
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'var(--color-success)', fontWeight: 600 }}>
                          R$ {comissao.valorComissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          {getStatusChip(comissao.status)}
                        </TableCell>
                        <TableCell>
                          <Box className="flex gap-1">
                            {comissao.status !== 'pago' && (
                              <Button
                                size="small"
                                variant="contained"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarcarPago(comissao.id);
                                }}
                                sx={{
                                  backgroundColor: 'var(--color-success)',
                                  textTransform: 'none',
                                  fontSize: '0.7rem',
                                  padding: '4px 8px',
                                  minWidth: 'auto',
                                  '&:hover': {
                                    backgroundColor: 'var(--color-success)',
                                    opacity: 0.9
                                  }
                                }}
                              >
                                Pagar
                              </Button>
                            )}
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetails(comissao);
                              }}
                              sx={{ color: 'var(--color-primary)' }}
                            >
                              <Visibility sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Top Corretores */}
        <Box>
          <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)', mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 3 }}>
                Top Corretores
              </Typography>
              <Box className="space-y-3">
                {topCorretores.map(([corretor, data], index) => (
                  <Box
                    key={corretor}
                    className="p-3 rounded-lg"
                    sx={{
                      backgroundColor: 'var(--bg-hover)',
                      border: '1px solid var(--border-default)'
                    }}
                  >
                    <Box className="flex items-center gap-3 mb-2">
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'var(--color-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          color: 'white',
                          fontSize: '0.875rem'
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Box flex={1}>
                        <Typography variant="body2" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                          {corretor}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                          {data.quantidade} {data.quantidade === 1 ? 'comissão' : 'comissões'}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h6" sx={{ color: 'var(--color-success)', fontWeight: 700 }}>
                      R$ {data.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

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
          Detalhes da Comissão
        </DialogTitle>
        <DialogContent>
          {selectedComissao && (
            <Box className="space-y-4 mt-2">
              <Box className="grid grid-cols-2 gap-4">
                <Box>
                  <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                    Corretor
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {selectedComissao.corretor}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                    Status
                  </Typography>
                  <Box className="mt-1">
                    {getStatusChip(selectedComissao.status)}
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ borderColor: 'var(--border-default)' }} />

              <Box className="grid grid-cols-2 gap-4">
                <Box>
                  <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                    Apólice
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {selectedComissao.apolice}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                    Categoria
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {selectedComissao.categoria}
                  </Typography>
                </Box>
              </Box>

              <Box className="grid grid-cols-2 gap-4">
                <Box>
                  <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                    Segurado
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {selectedComissao.segurado}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                    Seguradora
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {selectedComissao.seguradora}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor: 'var(--border-default)' }} />

              <Box className="grid grid-cols-2 gap-4">
                <Box>
                  <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                    Data da Venda
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {selectedComissao.dataVenda}
                  </Typography>
                </Box>
                {selectedComissao.dataPagamento && (
                  <Box>
                    <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                      Data do Pagamento
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                      {selectedComissao.dataPagamento}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ borderColor: 'var(--border-default)' }} />

              <Box className="grid grid-cols-2 gap-4">
                <Box>
                  <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                    Valor do Prêmio
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                    R$ {selectedComissao.valorPremio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                    Percentual
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                    {selectedComissao.percentualComissao}%
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  backgroundColor: 'var(--bg-hover)',
                  padding: 3,
                  borderRadius: 2,
                  border: '1px solid var(--border-default)'
                }}
              >
                <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                  Valor da Comissão
                </Typography>
                <Typography variant="h4" sx={{ color: 'var(--color-success)', fontWeight: 700 }}>
                  R$ {selectedComissao.valorComissao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </Typography>
              </Box>
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
          {selectedComissao?.status !== 'pago' && (
            <Button
              onClick={() => {
                if (selectedComissao) {
                  handleMarcarPago(selectedComissao.id);
                }
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
              Marcar como Pago
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
