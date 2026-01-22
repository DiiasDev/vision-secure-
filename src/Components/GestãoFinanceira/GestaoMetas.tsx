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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  LinearProgress
} from '@mui/material';
import { Add, Edit, Delete, TrendingUp, CalendarMonth } from '@mui/icons-material';

interface Meta {
  id: number;
  corretor: string;
  mes: string;
  ano: number;
  valorMeta: number;
  valorAtingido: number;
  categoria?: string;
}

const metasIniciais: Meta[] = [
  { id: 1, corretor: 'Carlos Silva', mes: 'Janeiro', ano: 2026, valorMeta: 120000, valorAtingido: 145000 },
  { id: 2, corretor: 'Ana Santos', mes: 'Janeiro', ano: 2026, valorMeta: 110000, valorAtingido: 132000 },
  { id: 3, corretor: 'Roberto Lima', mes: 'Janeiro', ano: 2026, valorMeta: 100000, valorAtingido: 118000 },
  { id: 4, corretor: 'Carlos Silva', mes: 'Fevereiro', ano: 2026, valorMeta: 125000, valorAtingido: 0 },
  { id: 5, corretor: 'Ana Santos', mes: 'Fevereiro', ano: 2026, valorMeta: 115000, valorAtingido: 0 },
  { id: 6, corretor: 'Mariana Costa', mes: 'Janeiro', ano: 2026, valorMeta: 90000, valorAtingido: 95000 },
];

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const corretores = [
  'Carlos Silva',
  'Ana Santos',
  'Roberto Lima',
  'Mariana Costa',
  'Pedro Oliveira',
  'Julia Ferreira',
  'Lucas Almeida',
  'Beatriz Souza'
];

export default function GestaoMetas() {
  const [metas, setMetas] = useState<Meta[]>(metasIniciais);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMeta, setEditingMeta] = useState<Meta | null>(null);
  const [formData, setFormData] = useState({
    corretor: '',
    mes: '',
    ano: new Date().getFullYear(),
    valorMeta: '',
    categoria: 'Geral'
  });

  const handleOpenDialog = (meta?: Meta) => {
    if (meta) {
      setEditingMeta(meta);
      setFormData({
        corretor: meta.corretor,
        mes: meta.mes,
        ano: meta.ano,
        valorMeta: meta.valorMeta.toString(),
        categoria: meta.categoria || 'Geral'
      });
    } else {
      setEditingMeta(null);
      setFormData({
        corretor: '',
        mes: '',
        ano: new Date().getFullYear(),
        valorMeta: '',
        categoria: 'Geral'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMeta(null);
  };

  const handleSaveMeta = () => {
    if (editingMeta) {
      // Editar meta existente
      setMetas(metas.map(m =>
        m.id === editingMeta.id
          ? {
              ...m,
              corretor: formData.corretor,
              mes: formData.mes,
              ano: formData.ano,
              valorMeta: parseFloat(formData.valorMeta),
              categoria: formData.categoria
            }
          : m
      ));
    } else {
      // Criar nova meta
      const novaMeta: Meta = {
        id: Math.max(...metas.map(m => m.id)) + 1,
        corretor: formData.corretor,
        mes: formData.mes,
        ano: formData.ano,
        valorMeta: parseFloat(formData.valorMeta),
        valorAtingido: 0,
        categoria: formData.categoria
      };
      setMetas([...metas, novaMeta]);
    }
    handleCloseDialog();
  };

  const handleDeleteMeta = (id: number) => {
    setMetas(metas.filter(m => m.id !== id));
  };

  const getPercentual = (meta: Meta) => {
    if (meta.valorAtingido === 0) return 0;
    return (meta.valorAtingido / meta.valorMeta) * 100;
  };

  const getStatusChip = (meta: Meta) => {
    const percentual = getPercentual(meta);
    if (meta.valorAtingido === 0) {
      return <Chip label="Em Andamento" size="small" sx={{ backgroundColor: 'var(--color-info-bg)', color: 'var(--color-info)' }} />;
    }
    if (percentual >= 100) {
      return <Chip label="Atingida" size="small" sx={{ backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)' }} />;
    }
    return <Chip label="Não Atingida" size="small" sx={{ backgroundColor: 'var(--color-danger-bg)', color: 'var(--color-danger)' }} />;
  };

  // Estatísticas
  const totalMetas = metas.length;
  const metasAtingidas = metas.filter(m => m.valorAtingido >= m.valorMeta && m.valorAtingido > 0).length;
  const metasEmAndamento = metas.filter(m => m.valorAtingido === 0).length;
  const valorTotalMetas = metas.reduce((acc, m) => acc + m.valorMeta, 0);
  const valorTotalAtingido = metas.reduce((acc, m) => acc + m.valorAtingido, 0);

  return (
    <Box
      className="p-6 min-h-screen"
      sx={{
        backgroundColor: 'var(--bg-app)'
      }}
    >
      {/* Header */}
      <Box className="mb-8">
        <Box className="flex items-center justify-between mb-4">
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: 'var(--text-primary)',
                fontWeight: 700,
                mb: 1
              }}
            >
              Gestão de Metas
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'var(--text-secondary)' }}
            >
              Configure e acompanhe as metas dos corretores
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: 'var(--color-primary)',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'var(--color-primary-hover)',
              }
            }}
          >
            Nova Meta
          </Button>
        </Box>
      </Box>

      {/* Estatísticas */}
      <Box className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Box className="flex items-center gap-2 mb-2">
              <CalendarMonth sx={{ color: 'var(--color-primary)', fontSize: 28 }} />
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Total de Metas
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              {totalMetas}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Box className="flex items-center gap-2 mb-2">
              <TrendingUp sx={{ color: 'var(--color-success)', fontSize: 28 }} />
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Metas Atingidas
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ color: 'var(--color-success)', fontWeight: 700 }}>
              {metasAtingidas}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Box className="flex items-center gap-2 mb-2">
              <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                Em Andamento
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ color: 'var(--color-info)', fontWeight: 700 }}>
              {metasEmAndamento}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <CardContent>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
              Valor Total
            </Typography>
            <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 700, mb: 1 }}>
              R$ {valorTotalMetas.toLocaleString('pt-BR')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-tertiary)' }}>
              Atingido: R$ {valorTotalAtingido.toLocaleString('pt-BR')}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tabela de Metas */}
      <Card sx={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 3 }}>
            Metas Cadastradas
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'var(--bg-table-header)' }}>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Corretor</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Período</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Categoria</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Meta</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Atingido</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Progresso</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {metas.map((meta) => {
                  const percentual = getPercentual(meta);
                  return (
                    <TableRow
                      key={meta.id}
                      sx={{
                        '&:hover': { backgroundColor: 'var(--bg-table-row-hover)' }
                      }}
                    >
                      <TableCell sx={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        {meta.corretor}
                      </TableCell>
                      <TableCell sx={{ color: 'var(--text-secondary)' }}>
                        {meta.mes}/{meta.ano}
                      </TableCell>
                      <TableCell sx={{ color: 'var(--text-secondary)' }}>
                        {meta.categoria || 'Geral'}
                      </TableCell>
                      <TableCell sx={{ color: 'var(--text-primary)' }}>
                        R$ {meta.valorMeta.toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell sx={{ color: 'var(--text-primary)' }}>
                        R$ {meta.valorAtingido.toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ width: 100 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(percentual, 100)}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: 'var(--bg-tertiary)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: percentual >= 100 ? 'var(--color-success)' : 'var(--color-primary)',
                                borderRadius: 3
                              }
                            }}
                          />
                          <Typography variant="caption" sx={{ color: 'var(--text-tertiary)', mt: 0.5 }}>
                            {percentual.toFixed(1)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(meta)}
                      </TableCell>
                      <TableCell>
                        <Box className="flex gap-1">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(meta)}
                            sx={{ color: 'var(--color-primary)' }}
                          >
                            <Edit sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteMeta(meta.id)}
                            sx={{ color: 'var(--color-danger)' }}
                          >
                            <Delete sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog de Criar/Editar Meta */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: 'var(--bg-card)',
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ color: 'var(--text-primary)', fontWeight: 600 }}>
          {editingMeta ? 'Editar Meta' : 'Nova Meta'}
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <TextField
              select
              label="Corretor"
              fullWidth
              value={formData.corretor}
              onChange={(e) => setFormData({ ...formData, corretor: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'var(--input-bg)',
                  '& fieldset': { borderColor: 'var(--input-border)' },
                },
                '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
                '& .MuiInputBase-input': { color: 'var(--text-primary)' }
              }}
            >
              {corretores.map((corretor) => (
                <MenuItem key={corretor} value={corretor}>
                  {corretor}
                </MenuItem>
              ))}
            </TextField>

            <Box className="grid grid-cols-2 gap-4">
              <TextField
                select
                label="Mês"
                fullWidth
                value={formData.mes}
                onChange={(e) => setFormData({ ...formData, mes: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--input-bg)',
                    '& fieldset': { borderColor: 'var(--input-border)' },
                  },
                  '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
                  '& .MuiInputBase-input': { color: 'var(--text-primary)' }
                }}
              >
                {meses.map((mes) => (
                  <MenuItem key={mes} value={mes}>
                    {mes}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                type="number"
                label="Ano"
                fullWidth
                value={formData.ano}
                onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--input-bg)',
                    '& fieldset': { borderColor: 'var(--input-border)' },
                  },
                  '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
                  '& .MuiInputBase-input': { color: 'var(--text-primary)' }
                }}
              />
            </Box>

            <TextField
              select
              label="Categoria"
              fullWidth
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'var(--input-bg)',
                  '& fieldset': { borderColor: 'var(--input-border)' },
                },
                '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
                '& .MuiInputBase-input': { color: 'var(--text-primary)' }
              }}
            >
              <MenuItem value="Geral">Geral</MenuItem>
              <MenuItem value="Auto">Auto</MenuItem>
              <MenuItem value="Vida">Vida</MenuItem>
              <MenuItem value="Residencial">Residencial</MenuItem>
              <MenuItem value="Empresarial">Empresarial</MenuItem>
            </TextField>

            <TextField
              type="number"
              label="Valor da Meta"
              fullWidth
              value={formData.valorMeta}
              onChange={(e) => setFormData({ ...formData, valorMeta: e.target.value })}
              InputProps={{
                startAdornment: <Typography sx={{ color: 'var(--text-secondary)', mr: 1 }}>R$</Typography>
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'var(--input-bg)',
                  '& fieldset': { borderColor: 'var(--input-border)' },
                },
                '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
                '& .MuiInputBase-input': { color: 'var(--text-primary)' }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: 'var(--text-secondary)',
              textTransform: 'none'
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveMeta}
            variant="contained"
            disabled={!formData.corretor || !formData.mes || !formData.valorMeta}
            sx={{
              backgroundColor: 'var(--color-primary)',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'var(--color-primary-hover)',
              }
            }}
          >
            {editingMeta ? 'Salvar' : 'Criar Meta'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
