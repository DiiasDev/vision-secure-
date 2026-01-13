import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Tabs,
  Tab,
  Box,
  Typography,
  Chip,
  Divider,
  Tooltip,
  CircularProgress,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CakeIcon from "@mui/icons-material/Cake";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoIcon from "@mui/icons-material/Info";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useState, useMemo } from "react";
import { isAdmin } from "../../Services/auth";
import { useNotificacoes } from "../../hooks/useNotificacoes";
import { limparTodasNotificacoes } from "../../Utils/limparNotificacoesDuplicadas";

type ModalNotificacaoProps = {
  open: boolean;
  onClose: () => void;
  corretorId?: string | null;
  onMarcarComoLida?: (id: string) => Promise<void>;
};

const getNotificationIcon = (categoria: string, tipo: string) => {
  // Priorizar categoria
  switch (categoria) {
    case "Seguros":
      return <WarningAmberIcon sx={{ color: "var(--color-warning)" }} />;
    case "Aniversarios":
      return <CakeIcon sx={{ color: "var(--color-info)" }} />;
    case "Movimentacoes":
      // Subcategorias de movimentação
      if (tipo === "Cadastro") {
        return <PersonAddIcon sx={{ color: "var(--color-success)" }} />;
      } else if (tipo === "Movimentacao") {
        return <DriveFileRenameOutlineIcon sx={{ color: "var(--color-info)" }} />;
      }
      return <DeleteIcon sx={{ color: "var(--color-danger)" }} />;
    case "Geral":
    default:
      return <InfoIcon sx={{ color: "var(--color-primary)" }} />;
  }
};

const formatarData = (dataString: string): string => {
  const data = new Date(dataString);
  const agora = new Date();
  const diff = agora.getTime() - data.getTime();
  const minutos = Math.floor(diff / 60000);
  const horas = Math.floor(diff / 3600000);
  const dias = Math.floor(diff / 86400000);

  if (minutos < 1) return "Agora";
  if (minutos < 60) return `${minutos}m atrás`;
  if (horas < 24) return `${horas}h atrás`;
  if (dias === 0) return "Hoje";
  if (dias === 1) return "Ontem";
  if (dias < 7) return `${dias} dias atrás`;
  return data.toLocaleDateString("pt-BR");
};

export default function ModalNotificacao({
  open,
  onClose,
  onMarcarComoLida,
}: ModalNotificacaoProps) {
  const [tabAtiva, setTabAtiva] = useState(0);
  const [verificando, setVerificando] = useState(false);
  const userIsAdmin = isAdmin();
  const { notificacoes, loading, carregar, marcarComoLida: hookMarcarComoLida, marcarTodasComoLidas, excluir, verificarManualmente } = useNotificacoes();

  const marcarComoLida = async (id: string) => {
    try {
      console.log("🔔 [MODAL] Iniciando marcar como lida:", id);
      if (onMarcarComoLida) {
        console.log("🔔 [MODAL] Usando callback onMarcarComoLida");
        await onMarcarComoLida(id);
      } else {
        console.log("🔔 [MODAL] Usando hookMarcarComoLida");
        await hookMarcarComoLida(id);
      }
      console.log("🔔 [MODAL] Recarregando lista...");
      await carregar(); // Recarregar lista após marcar
      console.log("✅ [MODAL] Notificação marcada com sucesso e lista recarregada");
    } catch (error: any) {
      console.error("❌ [MODAL] Erro ao marcar notificação:", error);
      console.error("❌ [MODAL] Stack:", error.stack);
    }
  };

  const handleMarcarTodasComoLidas = async () => {
    try {
      console.log("🔔 [MODAL] Iniciando marcar todas como lidas...");
      const total = await marcarTodasComoLidas();
      console.log(`🔔 [MODAL] ${total} notificações marcadas`);
      console.log("🔔 [MODAL] Recarregando lista...");
      await carregar(); // Recarregar lista após marcar
      console.log("✅ [MODAL] Lista recarregada com sucesso");
    } catch (error: any) {
      console.error("❌ [MODAL] Erro ao marcar todas:", error);
      console.error("❌ [MODAL] Stack:", error.stack);
    }
  };

  const handleVerificarManualmente = async () => {
    setVerificando(true);
    try {
      console.log("🔍 Iniciando verificação manual...");
      await verificarManualmente();
      alert("✅ Verificação concluída! Aniversários e vencimentos foram verificados.");
    } catch (error) {
      console.error("❌ Erro na verificação:", error);
      alert("❌ Erro ao verificar. Veja o console para detalhes.");
    } finally {
      setVerificando(false);
    }
  };

  const handleExcluir = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm("Deseja realmente excluir esta notificação?")) {
      await excluir(id);
    }
  };

  const handleLimparTodas = async () => {
    const confirmacao1 = window.confirm(
      "⚠️ ATENÇÃO!\n\nDeseja excluir TODAS as notificações?\n\nEsta ação NÃO PODE ser desfeita!"
    );
    
    if (!confirmacao1) return;
    
    const confirmacao2 = window.confirm(
      "Tem CERTEZA ABSOLUTA?\n\nTodas as " + notificacoes.length + " notificações serão excluídas permanentemente!"
    );
    
    if (!confirmacao2) return;
    
    try {
      console.log("🗑️ Iniciando limpeza total...");
      const total = await limparTodasNotificacoes();
      alert(`✅ ${total} notificações foram excluídas com sucesso!`);
      await carregar();
    } catch (error) {
      console.error("Erro ao limpar:", error);
      alert("❌ Erro ao limpar notificações. Verifique o console.");
    }
  };

  // Filtrar notificações
  const notificacoesFiltradas = useMemo(() => {
    let filtradas = notificacoes;

    // Se não for admin, filtrar por corretor (se necessário)
    // Por enquanto, o backend já filtra pelo usuário logado

    // Filtrar por tab (admin)
    if (userIsAdmin) {
      if (tabAtiva === 1) {
        // Seguros (vencimentos)
        filtradas = filtradas.filter((n) => n.categoria === "Seguros");
      } else if (tabAtiva === 2) {
        // Aniversários
        filtradas = filtradas.filter((n) => n.categoria === "Aniversarios");
      } else if (tabAtiva === 3) {
        // Movimentações do sistema
        filtradas = filtradas.filter((n) => n.categoria === "Movimentacoes");
      }
    }

    return filtradas;
  }, [userIsAdmin, tabAtiva, notificacoes]);

  // Contador de notificações não lidas
  const contadorNaoLidas = useMemo(() => {
    return notificacoesFiltradas.filter((n) => n.lida === 0).length;
  }, [notificacoesFiltradas]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "var(--bg-card)",
          color: "var(--text-primary)",
          borderRadius: 3,
          border: "1px solid var(--border-default)",
          boxShadow: "var(--shadow-lg)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--border-default)",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            Notificações
          </Typography>
          {contadorNaoLidas > 0 && (
            <Chip
              label={contadorNaoLidas}
              size="small"
              sx={{
                backgroundColor: "var(--color-danger)",
                color: "var(--text-inverse)",
                fontWeight: 600,
                height: 24,
                minWidth: 24,
              }}
            />
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {userIsAdmin && (
            <Tooltip title="Verificar aniversários e vencimentos" arrow>
              <Button
                size="small"
                startIcon={verificando ? <CircularProgress size={16} /> : <RefreshIcon />}
                onClick={handleVerificarManualmente}
                disabled={verificando}
                sx={{
                  color: "var(--color-info)",
                  textTransform: "none",
                  fontSize: "0.85rem",
                  "&:hover": {
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                  },
                }}
              >
                {verificando ? "Verificando..." : "Verificar"}
              </Button>
            </Tooltip>
          )}
          {userIsAdmin && notificacoesFiltradas.length > 0 && (
            <Tooltip title="Excluir todas as notificações" arrow>
              <Button
                size="small"
                startIcon={<DeleteSweepIcon />}
                onClick={handleLimparTodas}
                sx={{
                  color: "var(--color-danger)",
                  textTransform: "none",
                  fontSize: "0.85rem",
                  "&:hover": {
                    backgroundColor: "rgba(220, 38, 38, 0.1)",
                  },
                }}
              >
                Limpar Tudo
              </Button>
            </Tooltip>
          )}
          {contadorNaoLidas > 0 && (
            <Tooltip title="Marcar todas como lidas" arrow>
              <Button
                size="small"
                startIcon={<DoneAllIcon />}
                onClick={handleMarcarTodasComoLidas}
                sx={{
                  color: "var(--color-success)",
                  textTransform: "none",
                  fontSize: "0.85rem",
                  "&:hover": {
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                  },
                }}
              >
                Marcar todas
              </Button>
            </Tooltip>
          )}
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: "var(--text-secondary)",
              "&:hover": {
                backgroundColor: "var(--button-secondary-hover)",
                color: "var(--text-primary)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* Tabs para Admin */}
      {userIsAdmin && (
        <Tabs
          value={tabAtiva}
          onChange={(_, newValue) => setTabAtiva(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: "1px solid var(--border-default)",
            "& .MuiTab-root": {
              color: "var(--text-secondary)",
              textTransform: "none",
              fontWeight: 500,
              fontSize: "0.875rem",
              minHeight: 48,
              "&.Mui-selected": {
                color: "var(--color-primary)",
                fontWeight: 600,
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "var(--color-primary)",
              height: 3,
            },
          }}
        >
          <Tab label="Todas" />
          <Tab label="Seguros" />
          <Tab label="Aniversários" />
          <Tab label="Movimentações" />
        </Tabs>
      )}

      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              gap: 2,
            }}
          >
            <CircularProgress size={48} sx={{ color: "var(--color-primary)" }} />
            <Typography color="var(--text-secondary)" fontSize="0.95rem">
              Carregando notificações...
            </Typography>
          </Box>
        ) : notificacoesFiltradas.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 8,
              gap: 2,
            }}
          >
            <InfoIcon
              sx={{ fontSize: 64, color: "var(--text-secondary)", opacity: 0.3 }}
            />
            <Typography color="var(--text-secondary)" fontSize="0.95rem">
              Nenhuma notificação no momento
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 0 }}>
            {notificacoesFiltradas.map((notificacao, index) => (
              <Box key={notificacao.name}>
                <ListItem
                  sx={{
                    py: 2,
                    px: 3,
                    backgroundColor: notificacao.lida === 1
                      ? "transparent"
                      : "var(--bg-hover)",
                    opacity: notificacao.lida === 1 ? 0.7 : 1,
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: "var(--button-secondary-hover)",
                    },
                  }}
                  secondaryAction={
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      {notificacao.lida === 0 && (
                        <Tooltip title="Marcar como lida" arrow>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              marcarComoLida(notificacao.name);
                            }}
                            sx={{
                              color: "var(--text-secondary)",
                              transition: "all 0.2s",
                              "&:hover": {
                                color: "var(--color-success)",
                                backgroundColor: "rgba(34, 197, 94, 0.1)",
                                transform: "scale(1.1)",
                              },
                            }}
                          >
                            <CheckCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Excluir notificação" arrow>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={(e) => handleExcluir(notificacao.name, e)}
                          sx={{
                            color: "var(--text-secondary)",
                            transition: "all 0.2s",
                            "&:hover": {
                              color: "var(--color-danger)",
                              backgroundColor: "rgba(220, 38, 38, 0.1)",
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        backgroundColor: "transparent",
                        border: "2px solid var(--border-default)",
                      }}
                    >
                      {getNotificationIcon(notificacao.categoria, notificacao.tipo)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          fontWeight={notificacao.lida === 1 ? 500 : 700}
                          fontSize="0.95rem"
                          color="var(--text-primary)"
                        >
                          {notificacao.titulo}
                        </Typography>
                        {notificacao.lida === 0 && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: "var(--color-primary)",
                              ml: 1,
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography
                          fontSize="0.85rem"
                          color="var(--text-secondary)"
                          sx={{ mb: 0.5 }}
                        >
                          {notificacao.descricao}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography
                            fontSize="0.75rem"
                            color="var(--text-tertiary)"
                          >
                            {formatarData(notificacao.creation)}
                          </Typography>
                          {userIsAdmin && notificacao.criado_por_usuario && (
                            <>
                              <Typography
                                fontSize="0.75rem"
                                color="var(--text-tertiary)"
                              >
                                •
                              </Typography>
                              <Chip
                                label={notificacao.criado_por_usuario}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: "0.7rem",
                                  backgroundColor: "var(--bg-tertiary)",
                                  color: "var(--text-secondary)",
                                }}
                              />
                            </>
                          )}
                          {notificacao.prioridade && notificacao.prioridade !== "Normal" && notificacao.prioridade !== "Baixa" && (
                            <>
                              <Typography
                                fontSize="0.75rem"
                                color="var(--text-tertiary)"
                              >
                                •
                              </Typography>
                              <Chip
                                label={notificacao.prioridade}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: "0.7rem",
                                  backgroundColor: 
                                    notificacao.prioridade === "Critica" 
                                      ? "rgba(220, 38, 38, 0.2)"
                                      : notificacao.prioridade === "Alta"
                                      ? "rgba(220, 38, 38, 0.15)"
                                      : "rgba(234, 179, 8, 0.15)",
                                  color: 
                                    notificacao.prioridade === "Critica" || notificacao.prioridade === "Alta"
                                      ? "var(--color-danger)"
                                      : "var(--color-warning)",
                                  fontWeight: 600,
                                }}
                              />
                            </>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notificacoesFiltradas.length - 1 && (
                  <Divider sx={{ borderColor: "var(--border-default)" }} />
                )}
              </Box>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}