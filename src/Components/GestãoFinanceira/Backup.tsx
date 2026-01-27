import { useState, type ReactElement } from 'react';
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
  Chip,
  LinearProgress,
  Alert,
  AlertTitle,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CloudDownload,
  Download,
  CheckCircle,
  Schedule,
  Storage,
  Backup as BackupIcon,
  InsertDriveFile,
  Visibility,
  Delete,
  Refresh
} from '@mui/icons-material';
import DateRangeFilter from './DateRangeFilter';

interface PlanilhaAcerto {
  id: number;
  nome: string;
  dataGeracao: string;
  periodo: string;
  status: 'processado' | 'pendente';
  tamanho: string;
  registros: number;
}

interface DadosBackup {
  categoria: string;
  descricao: string;
  tamanho: string;
  registros: number;
  ultimaAtualizacao: string;
  incluirNoBackup: boolean;
  icon: ReactElement;
  color: string;
}

const planilhasAcerto: PlanilhaAcerto[] = [
  {
    id: 1,
    nome: 'Acerto_Janeiro_2026.xlsx',
    dataGeracao: '25/01/2026 14:30',
    periodo: 'Janeiro/2026',
    status: 'processado',
    tamanho: '2.4 MB',
    registros: 342
  },
  {
    id: 2,
    nome: 'Acerto_Dezembro_2025.xlsx',
    dataGeracao: '26/12/2025 16:45',
    periodo: 'Dezembro/2025',
    status: 'processado',
    tamanho: '3.1 MB',
    registros: 425
  },
  {
    id: 3,
    nome: 'Acerto_Novembro_2025.xlsx',
    dataGeracao: '24/11/2025 10:20',
    periodo: 'Novembro/2025',
    status: 'processado',
    tamanho: '2.8 MB',
    registros: 398
  },
  {
    id: 4,
    nome: 'Acerto_Outubro_2025.xlsx',
    dataGeracao: '23/10/2025 15:10',
    periodo: 'Outubro/2025',
    status: 'processado',
    tamanho: '2.6 MB',
    registros: 367
  },
  {
    id: 5,
    nome: 'Acerto_Setembro_2025.xlsx',
    dataGeracao: '22/09/2025 11:30',
    periodo: 'Setembro/2025',
    status: 'processado',
    tamanho: '2.3 MB',
    registros: 329
  }
];

const dadosParaBackup: DadosBackup[] = [
  {
    categoria: 'Seguros',
    descricao: 'Todas as apólices, coberturas e históricos de seguros',
    tamanho: '145 MB',
    registros: 3420,
    ultimaAtualizacao: '26/01/2026 08:00',
    incluirNoBackup: true,
    icon: <InsertDriveFile sx={{ fontSize: 32 }} />,
    color: 'var(--color-primary)'
  },
  {
    categoria: 'Segurados',
    descricao: 'Cadastro completo de segurados e dependentes',
    tamanho: '89 MB',
    registros: 2850,
    ultimaAtualizacao: '26/01/2026 08:00',
    incluirNoBackup: true,
    icon: <InsertDriveFile sx={{ fontSize: 32 }} />,
    color: 'var(--color-success)'
  },
  {
    categoria: 'Corretores',
    descricao: 'Dados de corretores, comissões e performance',
    tamanho: '52 MB',
    registros: 1245,
    ultimaAtualizacao: '26/01/2026 08:00',
    incluirNoBackup: true,
    icon: <InsertDriveFile sx={{ fontSize: 32 }} />,
    color: 'var(--color-warning)'
  },
  {
    categoria: 'Financeiro',
    descricao: 'Transações, acertos, comissões e pagamentos',
    tamanho: '198 MB',
    registros: 8650,
    ultimaAtualizacao: '26/01/2026 08:00',
    incluirNoBackup: true,
    icon: <InsertDriveFile sx={{ fontSize: 32 }} />,
    color: 'var(--color-info)'
  },
  {
    categoria: 'Veículos',
    descricao: 'Cadastro de veículos segurados e histórico',
    tamanho: '67 MB',
    registros: 2340,
    ultimaAtualizacao: '26/01/2026 08:00',
    incluirNoBackup: true,
    icon: <InsertDriveFile sx={{ fontSize: 32 }} />,
    color: 'var(--color-danger)'
  },
  {
    categoria: 'Documentos',
    descricao: 'Contratos, propostas e documentação anexada',
    tamanho: '423 MB',
    registros: 5670,
    ultimaAtualizacao: '26/01/2026 08:00',
    incluirNoBackup: true,
    icon: <InsertDriveFile sx={{ fontSize: 32 }} />,
    color: '#9333ea'
  }
];

export default function Backup() {
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackup, setLastBackup] = useState('25/01/2026 às 23:45');

  const handleGerarBackup = () => {
    setIsBackingUp(true);
    setBackupProgress(0);

    // Simular progresso do backup
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          setLastBackup(new Date().toLocaleString('pt-BR'));
          alert('Backup completo gerado com sucesso!');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleDownloadPlanilha = (planilha: PlanilhaAcerto) => {
    console.log(`Baixando planilha: ${planilha.nome}`);
    alert(`Download iniciado: ${planilha.nome}`);
  };

  const handleVisualizarPlanilha = (planilha: PlanilhaAcerto) => {
    console.log(`Visualizando planilha: ${planilha.nome}`);
    alert(`Abrindo preview: ${planilha.nome}`);
  };

  const totalTamanho = dadosParaBackup
    .filter(d => d.incluirNoBackup)
    .reduce((acc, curr) => {
      const tamanho = parseFloat(curr.tamanho.replace(' MB', ''));
      return acc + tamanho;
    }, 0);

  const totalRegistros = dadosParaBackup
    .filter(d => d.incluirNoBackup)
    .reduce((acc, curr) => acc + curr.registros, 0);

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
          Backup e Planilhas de Acerto
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'var(--text-secondary)' }}
        >
          Gerencie backups do sistema e visualize planilhas de acerto financeiro
        </Typography>
      </Box>

      {/* Cards de Status */}
      <Box className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Box className="flex items-center justify-between mb-2">
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Último Backup
              </Typography>
              <Schedule sx={{ color: 'var(--color-primary)', fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              {lastBackup}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
              Backup automático
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Box className="flex items-center justify-between mb-2">
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Tamanho Total
              </Typography>
              <Storage sx={{ color: 'var(--color-success)', fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              {totalTamanho.toFixed(1)} MB
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
              {totalRegistros.toLocaleString('pt-BR')} registros
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Box className="flex items-center justify-between mb-2">
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Planilhas Geradas
              </Typography>
              <InsertDriveFile sx={{ color: 'var(--color-warning)', fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              {planilhasAcerto.length}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
              Últimos 5 meses
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Box className="flex items-center justify-between mb-2">
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Status do Sistema
              </Typography>
              <CheckCircle sx={{ color: 'var(--color-success)', fontSize: 24 }} />
            </Box>
            <Typography variant="h6" sx={{ color: 'var(--color-success)', fontWeight: 700 }}>
              Operacional
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
              Todos os serviços ativos
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Alert de Backup em Progresso */}
      {isBackingUp && (
        <Alert
          severity="info"
          sx={{
            mb: 4,
            backgroundColor: 'var(--color-info-bg)',
            color: 'var(--color-info)',
            border: '1px solid var(--color-info)',
            '& .MuiAlert-icon': {
              color: 'var(--color-info)'
            }
          }}
        >
          <AlertTitle>Backup em Progresso</AlertTitle>
          Gerando backup completo do sistema... Por favor, aguarde.
          <LinearProgress
            variant="determinate"
            value={backupProgress}
            sx={{
              mt: 2,
              backgroundColor: 'var(--bg-hover)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'var(--color-info)'
              }
            }}
          />
          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
            {backupProgress}% concluído
          </Typography>
        </Alert>
      )}

      {/* Seção de Backup */}
      <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)', mb: 4 }}>
        <CardContent>
          <Box className="flex items-center justify-between mb-4">
            <Box>
              <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 1 }}>
                Backup Completo do Sistema
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Faça backup de todos os dados importantes do sistema
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<BackupIcon />}
              onClick={handleGerarBackup}
              disabled={isBackingUp}
              sx={{
                backgroundColor: 'var(--color-primary)',
                textTransform: 'none',
                padding: '12px 32px',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-hover)',
                }
              }}
            >
              Gerar Backup Completo
            </Button>
          </Box>

          <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', mb: 2, fontWeight: 600 }}>
            Dados incluídos no backup:
          </Typography>

          <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dadosParaBackup.map((dado) => (
              <Box
                key={dado.categoria}
                sx={{
                  backgroundColor: 'var(--bg-hover)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 2,
                  p: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: dado.color,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box className="flex items-start gap-3">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: 'var(--bg-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: dado.color
                    }}
                  >
                    {dado.icon}
                  </Box>
                  <Box flex={1}>
                    <Typography variant="subtitle2" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 0.5 }}>
                      {dado.categoria}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'var(--text-secondary)', display: 'block', mb: 1 }}>
                      {dado.descricao}
                    </Typography>
                    <Box className="flex items-center justify-between">
                      <Chip
                        label={dado.tamanho}
                        size="small"
                        sx={{
                          backgroundColor: 'var(--bg-card)',
                          color: 'var(--text-primary)',
                          fontSize: '0.7rem'
                        }}
                      />
                      <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
                        {dado.registros.toLocaleString('pt-BR')} itens
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Seção de Planilhas de Acerto */}
      <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <CardContent>
          <Box className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <Box>
              <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 1 }}>
                Planilhas de Acerto Geradas
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Histórico de planilhas de conciliação financeira
              </Typography>
            </Box>

            <Box className="flex items-center gap-3">
              <DateRangeFilter />
              <Tooltip title="Atualizar lista">
                <IconButton
                  sx={{
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-hover)',
                    '&:hover': {
                      backgroundColor: 'var(--bg-table-row-hover)'
                    }
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'var(--bg-table-header)' }}>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Nome do Arquivo</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Data de Geração</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Período</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Registros</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Tamanho</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {planilhasAcerto.map((planilha) => (
                  <TableRow
                    key={planilha.id}
                    sx={{
                      '&:hover': { backgroundColor: 'var(--bg-table-row-hover)' }
                    }}
                  >
                    <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                      <Box className="flex items-center gap-2">
                        <InsertDriveFile sx={{ color: 'var(--color-success)', fontSize: 20 }} />
                        {planilha.nome}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'var(--text-secondary)' }}>
                      {planilha.dataGeracao}
                    </TableCell>
                    <TableCell sx={{ color: 'var(--text-secondary)' }}>
                      {planilha.periodo}
                    </TableCell>
                    <TableCell sx={{ color: 'var(--text-secondary)' }}>
                      {planilha.registros.toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell sx={{ color: 'var(--text-secondary)' }}>
                      {planilha.tamanho}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={planilha.status === 'processado' ? 'Processado' : 'Pendente'}
                        size="small"
                        icon={planilha.status === 'processado' ? <CheckCircle sx={{ fontSize: 16 }} /> : <Schedule sx={{ fontSize: 16 }} />}
                        sx={{
                          backgroundColor: planilha.status === 'processado' ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                          color: planilha.status === 'processado' ? 'var(--color-success)' : 'var(--color-warning)',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          '& .MuiChip-icon': {
                            color: planilha.status === 'processado' ? 'var(--color-success)' : 'var(--color-warning)'
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box className="flex gap-1">
                        <Tooltip title="Visualizar">
                          <IconButton
                            size="small"
                            onClick={() => handleVisualizarPlanilha(planilha)}
                            sx={{ color: 'var(--color-primary)' }}
                          >
                            <Visibility sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            onClick={() => handleDownloadPlanilha(planilha)}
                            sx={{ color: 'var(--color-success)' }}
                          >
                            <Download sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            sx={{ color: 'var(--color-danger)' }}
                          >
                            <Delete sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
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
  );
}
