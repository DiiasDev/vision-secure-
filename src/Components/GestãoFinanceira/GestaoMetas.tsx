import { useEffect, useState } from "react";
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
  LinearProgress,
} from "@mui/material";
import { getCorretor } from "../../Services/corretores";
import {
  Add,
  Edit,
  Delete,
  TrendingUp,
  CalendarMonth,
} from "@mui/icons-material";
import {
  newMeta,
  atualizarMeta,
  deletarMeta,
  type MetaApi,
  getTipoMetaSupport,
} from "../../Services/metas";
import { Financeiro } from "../../Services/Financeiro";

interface Meta {
  name: string;
  corretor: string;
  mes: string;
  ano: number;
  valorMeta: number;
  valorAtingido: number;
  categoria?: string;
  tipo_meta?: "Mensal" | "Anual";
}

const mapMetaFromApi = (meta: MetaApi): Meta => ({
  name: meta.name || `${meta.corretor}-${meta.mes}-${meta.ano}`,
  corretor: meta.corretor,
  mes: meta.mes,
  ano: Number(meta.ano),
  valorMeta: Number(meta.valor_meta || 0),
  valorAtingido: Number(meta.valor_atingido || 0),
  categoria: meta.categoria || "Geral",
  tipo_meta: meta.tipo_meta || "Mensal",
});

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const CORRETORA_GERAL = "Corretora";

// const corretores = [
//   'Carlos Silva',
//   'Ana Santos',
//   'Roberto Lima',
//   'Mariana Costa',
//   'Pedro Oliveira',
//   'Julia Ferreira',
//   'Lucas Almeida',
//   'Beatriz Souza'
// ];

export default function GestaoMetas() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMeta, setEditingMeta] = useState<Meta | null>(null);
  const [corretores, setCorretores] = useState<string[]>([]);
  const [suportaTipoMeta, setSuportaTipoMeta] = useState(true);
  const [formData, setFormData] = useState({
    corretor: "",
    mes: "",
    tipo_meta: "Mensal" as "Mensal" | "Anual",
    ano: new Date().getFullYear(),
    valorMeta: "",
    categoria: "Geral",
  });

  const recarregarMetas = async () => {
    const financeiro = new Financeiro();
    const lista = await financeiro.getMetasComProgresso();
    setMetas(lista.map(mapMetaFromApi));
  };

  useEffect(() => {
    let isMounted = true;
    const carregarCorretores = async () => {
      try {
        const lista = await getCorretor();
        if (isMounted) {
          setCorretores(
            [
              CORRETORA_GERAL,
              ...lista
                .map((corretor) => corretor.nome_completo)
                .filter((nome) => Boolean(nome)),
            ],
          );
        }
      } catch (error) {
        console.error("Erro ao carregar corretores:", error);
        if (isMounted) {
          setCorretores([]);
        }
      }
    };
    carregarCorretores();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const carregarMetas = async () => {
      try {
        const financeiro = new Financeiro();
        const lista = await financeiro.getMetasComProgresso();
        if (isMounted) {
          setMetas(lista.map(mapMetaFromApi));
          setSuportaTipoMeta(getTipoMetaSupport() !== false);
        }
      } catch (error) {
        console.error("Erro ao carregar metas:", error);
        if (isMounted) {
          setMetas([]);
        }
      }
    };
    carregarMetas();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenDialog = (meta?: Meta) => {
    if (meta) {
      setEditingMeta(meta);
      setFormData({
        corretor: meta.corretor,
        mes: meta.mes,
        tipo_meta: meta.tipo_meta || "Mensal",
        ano: meta.ano,
        valorMeta: meta.valorMeta.toString(),
        categoria: meta.categoria || "Geral",
      });
    } else {
      setEditingMeta(null);
      setFormData({
        corretor: "",
        mes: "",
        tipo_meta: "Mensal",
        ano: new Date().getFullYear(),
        valorMeta: "",
        categoria: "Geral",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMeta(null);
  };

  const handleSaveMeta = async () => {
    const isDuplicada =
      formData.tipo_meta === "Mensal" &&
      metas.some((meta) => {
        if (editingMeta && meta.name === editingMeta.name) return false;
        return (
          meta.tipo_meta === "Mensal" &&
          meta.corretor === formData.corretor &&
          meta.mes === formData.mes &&
          meta.ano === formData.ano &&
          (meta.categoria || "Geral") === (formData.categoria || "Geral")
        );
      });
    if (isDuplicada) {
      window.alert(
        "Já existe uma meta deste tipo para este corretor no mesmo mês e ano.",
      );
      return;
    }

    const valorMetaNumber = Number(formData.valorMeta || 0);
    const payload: MetaApi = {
      corretor: formData.corretor,
      mes: formData.tipo_meta === "Anual" ? "" : formData.mes,
      tipo_meta: formData.tipo_meta,
      ano: formData.ano,
      valor_meta: valorMetaNumber,
      categoria: formData.categoria,
    };
    if (editingMeta) {
      // Editar meta existente
      try {
        const atualizada = await atualizarMeta(editingMeta.name, payload);
        setMetas((prev) =>
          prev.map((m) =>
            m.name === editingMeta.name ? mapMetaFromApi(atualizada) : m,
          ),
        );
        await recarregarMetas();
      } catch (error) {
        console.error("Erro ao atualizar meta:", error);
        return;
      }
    } else {
      // Criar nova meta
      try {
        const criada = await newMeta({
          ...payload,
          valor_atingido: 0,
        });
        setMetas((prev) => [mapMetaFromApi(criada), ...prev]);
        await recarregarMetas();
      } catch (error) {
        console.error("Erro ao criar meta:", error);
        return;
      }
    }
    handleCloseDialog();
  };

  const handleDeleteMeta = async (name: string) => {
    try {
      await deletarMeta(name);
      setMetas((prev) => prev.filter((m) => m.name !== name));
    } catch (error) {
      console.error("Erro ao deletar meta:", error);
    }
  };

  const getPercentual = (meta: Meta) => {
    if (meta.valorAtingido === 0 || meta.valorMeta === 0) return 0;
    return (meta.valorAtingido / meta.valorMeta) * 100;
  };

  const getStatusChip = (meta: Meta) => {
    const percentual = getPercentual(meta);
    if (meta.valorAtingido === 0) {
      return (
        <Chip
          label="Em Andamento"
          size="small"
          sx={{
            backgroundColor: "var(--color-info-bg)",
            color: "var(--color-info)",
          }}
        />
      );
    }
    if (percentual >= 100) {
      return (
        <Chip
          label="Atingida"
          size="small"
          sx={{
            backgroundColor: "var(--color-success-bg)",
            color: "var(--color-success)",
          }}
        />
      );
    }
    return (
      <Chip
        label="Não Atingida"
        size="small"
        sx={{
          backgroundColor: "var(--color-danger-bg)",
          color: "var(--color-danger)",
        }}
      />
    );
  };

  // Estatísticas
  const totalMetas = metas.length;
  const metasAtingidas = metas.filter(
    (m) => m.valorAtingido >= m.valorMeta && m.valorAtingido > 0,
  ).length;
  const metasEmAndamento = metas.filter((m) => m.valorAtingido === 0).length;
  const valorTotalMetas = metas.reduce((acc, m) => acc + m.valorMeta, 0);
  const valorTotalAtingido = metas.reduce((acc, m) => acc + m.valorAtingido, 0);

  return (
    <Box
      className="p-6 min-h-screen w-full"
      sx={{ backgroundColor: "var(--bg-app)" }}
    >
      {/* Header */}
      <Box className="mb-8 w-full">
        <Box className="flex items-center justify-between mb-4">
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: "var(--text-primary)",
                fontWeight: 700,
                mb: 1,
              }}
            >
              Gestão de Metas
            </Typography>
            <Typography variant="body1" sx={{ color: "var(--text-secondary)" }}>
              Configure e acompanhe as metas dos corretores
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: "var(--color-primary)",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "var(--color-primary-hover)",
              },
            }}
          >
            Nova Meta
          </Button>
        </Box>
      </Box>

      {/* Estatísticas */}
      <Box className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <Card
          sx={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-default)",
          }}
        >
          <CardContent>
            <Box className="flex items-center gap-2 mb-2">
              <CalendarMonth
                sx={{ color: "var(--color-primary)", fontSize: 28 }}
              />
              <Typography
                variant="body2"
                sx={{ color: "var(--text-secondary)" }}
              >
                Total de Metas
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{ color: "var(--text-primary)", fontWeight: 700 }}
            >
              {totalMetas}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-default)",
          }}
        >
          <CardContent>
            <Box className="flex items-center gap-2 mb-2">
              <TrendingUp
                sx={{ color: "var(--color-success)", fontSize: 28 }}
              />
              <Typography
                variant="body2"
                sx={{ color: "var(--text-secondary)" }}
              >
                Metas Atingidas
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{ color: "var(--color-success)", fontWeight: 700 }}
            >
              {metasAtingidas}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-default)",
          }}
        >
          <CardContent>
            <Box className="flex items-center gap-2 mb-2">
              <Typography
                variant="body2"
                sx={{ color: "var(--text-secondary)" }}
              >
                Em Andamento
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{ color: "var(--color-info)", fontWeight: 700 }}
            >
              {metasEmAndamento}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-default)",
          }}
        >
          <CardContent>
            <Typography
              variant="body2"
              sx={{ color: "var(--text-secondary)", mb: 2 }}
            >
              Valor Total
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: "var(--text-primary)", fontWeight: 700, mb: 1 }}
            >
              R$ {valorTotalMetas.toLocaleString("pt-BR")}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "var(--text-tertiary)" }}
            >
              Atingido: R$ {valorTotalAtingido.toLocaleString("pt-BR")}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tabela de Metas */}
      <Card
        sx={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-default)",
          width: "100%",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{ color: "var(--text-primary)", fontWeight: 600, mb: 3 }}
          >
            Metas Cadastradas
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "var(--bg-table-header)" }}>
                  <TableCell
                    sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                  >
                    Corretor
                  </TableCell>
                  <TableCell
                    sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                  >
                    Período
                  </TableCell>
                  <TableCell
                    sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                  >
                    Categoria
                  </TableCell>
                  <TableCell
                    sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                  >
                    Meta
                  </TableCell>
                  <TableCell
                    sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                  >
                    Atingido
                  </TableCell>
                  <TableCell
                    sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                  >
                    Progresso
                  </TableCell>
                  <TableCell
                    sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{ color: "var(--text-primary)", fontWeight: 600 }}
                  >
                    Ações
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {metas.map((meta) => {
                  const percentual = getPercentual(meta);
                  return (
                    <TableRow
                      key={meta.name}
                      sx={{
                        "&:hover": {
                          backgroundColor: "var(--bg-table-row-hover)",
                        },
                      }}
                    >
                      <TableCell
                        sx={{ color: "var(--text-primary)", fontWeight: 500 }}
                      >
                        {meta.corretor}
                      </TableCell>
                      <TableCell sx={{ color: "var(--text-secondary)" }}>
                        {meta.tipo_meta === "Anual"
                          ? `Ano ${meta.ano}`
                          : `${meta.mes}/${meta.ano}`}
                      </TableCell>
                      <TableCell sx={{ color: "var(--text-secondary)" }}>
                        {meta.categoria || "Geral"}
                      </TableCell>
                      <TableCell sx={{ color: "var(--text-primary)" }}>
                        R$ {meta.valorMeta.toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell sx={{ color: "var(--text-primary)" }}>
                        R$ {meta.valorAtingido.toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ width: 100 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(percentual, 100)}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: "var(--bg-tertiary)",
                              "& .MuiLinearProgress-bar": {
                                backgroundColor:
                                  percentual >= 100
                                    ? "var(--color-success)"
                                    : "var(--color-primary)",
                                borderRadius: 3,
                              },
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ color: "var(--text-tertiary)", mt: 0.5 }}
                          >
                            {percentual.toFixed(1)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{getStatusChip(meta)}</TableCell>
                      <TableCell>
                        <Box className="flex gap-1">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(meta)}
                            sx={{ color: "var(--color-primary)" }}
                          >
                            <Edit sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteMeta(meta.name)}
                            sx={{ color: "var(--color-danger)" }}
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
            backgroundColor: "var(--bg-card)",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ color: "var(--text-primary)", fontWeight: 600 }}>
          {editingMeta ? "Editar Meta" : "Nova Meta"}
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <TextField
              select
              label="Tipo de Meta"
              fullWidth
              value={formData.tipo_meta}
              disabled={!suportaTipoMeta}
              helperText={
                !suportaTipoMeta
                  ? "Atualize o DocType para usar metas anuais."
                  : " "
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tipo_meta: e.target.value as "Mensal" | "Anual",
                  mes: e.target.value === "Anual" ? "" : formData.mes,
                })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "var(--input-bg)",
                  "& fieldset": { borderColor: "var(--input-border)" },
                },
                "& .MuiInputLabel-root": { color: "var(--text-secondary)" },
                "& .MuiInputBase-input": { color: "var(--text-primary)" },
              }}
            >
              <MenuItem value="Mensal">Mensal</MenuItem>
              <MenuItem value="Anual">Anual</MenuItem>
            </TextField>

            <TextField
              select
              label="Corretor"
              fullWidth
              value={formData.corretor}
              onChange={(e) =>
                setFormData({ ...formData, corretor: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "var(--input-bg)",
                  "& fieldset": { borderColor: "var(--input-border)" },
                },
                "& .MuiInputLabel-root": { color: "var(--text-secondary)" },
                "& .MuiInputBase-input": { color: "var(--text-primary)" },
              }}
            >
              {corretores.map((corretor) => (
                <MenuItem key={corretor} value={corretor}>
                  {corretor === CORRETORA_GERAL
                    ? "Corretora (Geral)"
                    : corretor}
                </MenuItem>
              ))}
            </TextField>

            <Box className="grid grid-cols-2 gap-4">
              <TextField
                select
                label="Mês"
                fullWidth
                value={formData.mes}
                disabled={formData.tipo_meta === "Anual"}
                onChange={(e) =>
                  setFormData({ ...formData, mes: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "var(--input-bg)",
                    "& fieldset": { borderColor: "var(--input-border)" },
                  },
                  "& .MuiInputLabel-root": { color: "var(--text-secondary)" },
                  "& .MuiInputBase-input": { color: "var(--text-primary)" },
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
                onChange={(e) =>
                  setFormData({ ...formData, ano: parseInt(e.target.value) })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "var(--input-bg)",
                    "& fieldset": { borderColor: "var(--input-border)" },
                  },
                  "& .MuiInputLabel-root": { color: "var(--text-secondary)" },
                  "& .MuiInputBase-input": { color: "var(--text-primary)" },
                }}
              />
            </Box>

            <TextField
              select
              label="Categoria"
              fullWidth
              value={formData.categoria}
              onChange={(e) =>
                setFormData({ ...formData, categoria: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "var(--input-bg)",
                  "& fieldset": { borderColor: "var(--input-border)" },
                },
                "& .MuiInputLabel-root": { color: "var(--text-secondary)" },
                "& .MuiInputBase-input": { color: "var(--text-primary)" },
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
              onChange={(e) =>
                setFormData({ ...formData, valorMeta: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <Typography sx={{ color: "var(--text-secondary)", mr: 1 }}>
                    R$
                  </Typography>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "var(--input-bg)",
                  "& fieldset": { borderColor: "var(--input-border)" },
                },
                "& .MuiInputLabel-root": { color: "var(--text-secondary)" },
                "& .MuiInputBase-input": { color: "var(--text-primary)" },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: "var(--text-secondary)",
              textTransform: "none",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveMeta}
            variant="contained"
            disabled={
              !formData.corretor ||
              !formData.valorMeta ||
              (formData.tipo_meta === "Mensal" && !formData.mes)
            }
            sx={{
              backgroundColor: "var(--color-primary)",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "var(--color-primary-hover)",
              },
            }}
          >
            {editingMeta ? "Salvar" : "Criar Meta"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
