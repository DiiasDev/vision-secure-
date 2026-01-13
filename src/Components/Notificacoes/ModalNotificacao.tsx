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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CakeIcon from "@mui/icons-material/Cake";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoIcon from "@mui/icons-material/Info";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useState, useMemo } from "react";
import { isAdmin } from "../../Services/auth";

type NotificationType =
  | "seguro-vencer"
  | "aniversario"
  | "novo-cadastro"
  | "edicao"
  | "exclusao"
  | "info";

type Notificacao = {
  id: string;
  tipo: NotificationType;
  titulo: string;
  descricao: string;
  data: Date;
  lida: boolean;
  corretorId?: string;
  corretorNome?: string;
};

type ModalNotificacaoProps = {
  open: boolean;
  onClose: () => void;
  corretorId?: string | null;
};

// Dados mockados - substituir por dados reais depois
const notificacoesMockadas: Notificacao[] = [
  {
    id: "1",
    tipo: "seguro-vencer",
    titulo: "Seguro a vencer",
    descricao: "Seguro do veículo ABC-1234 vence em 7 dias",
    data: new Date(2026, 0, 10),
    lida: false,
    corretorId: "COR-001",
    corretorNome: "João Silva",
  },
  {
    id: "2",
    tipo: "aniversario",
    titulo: "Aniversário de cliente",
    descricao: "Maria Santos faz aniversário amanhã",
    data: new Date(2026, 0, 11),
    lida: false,
    corretorId: "COR-001",
    corretorNome: "João Silva",
  },
  {
    id: "3",
    tipo: "seguro-vencer",
    titulo: "Seguro a vencer",
    descricao: "Seguro do veículo XYZ-5678 vence em 3 dias",
    data: new Date(2026, 0, 12),
    lida: false,
    corretorId: "COR-002",
    corretorNome: "Pedro Oliveira",
  },
  {
    id: "4",
    tipo: "novo-cadastro",
    titulo: "Novo segurado cadastrado",
    descricao: "Pedro Oliveira cadastrou um novo segurado",
    data: new Date(2026, 0, 12, 10, 30),
    lida: false,
    corretorId: "COR-002",
    corretorNome: "Pedro Oliveira",
  },
  {
    id: "5",
    tipo: "edicao",
    titulo: "Seguro atualizado",
    descricao: "João Silva atualizou dados de um seguro",
    data: new Date(2026, 0, 12, 14, 15),
    lida: false,
    corretorId: "COR-001",
    corretorNome: "João Silva",
  },
  {
    id: "6",
    tipo: "aniversario",
    titulo: "Aniversário de cliente",
    descricao: "Carlos Mendes faz aniversário em 3 dias",
    data: new Date(2026, 0, 11),
    lida: true,
    corretorId: "COR-002",
    corretorNome: "Pedro Oliveira",
  },
  {
    id: "7",
    tipo: "exclusao",
    titulo: "Veículo removido",
    descricao: "João Silva removeu um veículo do sistema",
    data: new Date(2026, 0, 11, 16, 45),
    lida: true,
    corretorId: "COR-001",
    corretorNome: "João Silva",
  },
];

const getNotificationIcon = (tipo: NotificationType) => {
  switch (tipo) {
    case "seguro-vencer":
      return <WarningAmberIcon sx={{ color: "var(--color-warning)" }} />;
    case "aniversario":
      return <CakeIcon sx={{ color: "var(--color-info)" }} />;
    case "novo-cadastro":
      return <PersonAddIcon sx={{ color: "var(--color-success)" }} />;
    case "edicao":
      return <DriveFileRenameOutlineIcon sx={{ color: "var(--color-info)" }} />;
    case "exclusao":
      return <DeleteIcon sx={{ color: "var(--color-danger)" }} />;
    default:
      return <InfoIcon sx={{ color: "var(--color-primary)" }} />;
  }
};

const formatarData = (data: Date): string => {
  const agora = new Date();
  const diff = agora.getTime() - data.getTime();
  const minutos = Math.floor(diff / 60000);
  const horas = Math.floor(diff / 3600000);
  const dias = Math.floor(diff / 86400000);

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
  corretorId,
}: ModalNotificacaoProps) {
  const [tabAtiva, setTabAtiva] = useState(0);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(notificacoesMockadas);
  const userIsAdmin = isAdmin();

  const marcarComoLida = (id: string) => {
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  };

  // Filtrar notificações
  const notificacoesFiltradas = useMemo(() => {
    if (!userIsAdmin) {
      // Corretor vê apenas suas notificações
      return notificacoes.filter((n) => n.corretorId === corretorId);
    }

    // Admin vê todas, mas pode filtrar por tab
    if (tabAtiva === 0) {
      // Todas as notificações
      return notificacoes;
    } else if (tabAtiva === 1) {
      // Seguros a vencer
      return notificacoes.filter((n) => n.tipo === "seguro-vencer");
    } else if (tabAtiva === 2) {
      // Aniversários
      return notificacoes.filter((n) => n.tipo === "aniversario");
    } else if (tabAtiva === 3) {
      // Movimentações do sistema
      return notificacoes.filter((n) =>
        ["novo-cadastro", "edicao", "exclusao"].includes(n.tipo)
      );
    }
    return notificacoes;
  }, [userIsAdmin, corretorId, tabAtiva, notificacoes]);

  // Contador de notificações não lidas
  const contadorNaoLidas = useMemo(() => {
    return notificacoesFiltradas.filter((n) => !n.lida).length;
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
        {notificacoesFiltradas.length === 0 ? (
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
              <Box key={notificacao.id}>
                <ListItem
                  sx={{
                    py: 2,
                    px: 3,
                    backgroundColor: notificacao.lida
                      ? "transparent"
                      : "var(--bg-hover)",
                    opacity: notificacao.lida ? 0.7 : 1,
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: "var(--button-secondary-hover)",
                    },
                  }}
                  secondaryAction={
                    !notificacao.lida && (
                      <Tooltip title="Marcar como lida" arrow>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            marcarComoLida(notificacao.id);
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
                    )
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        backgroundColor: "transparent",
                        border: "2px solid var(--border-default)",
                      }}
                    >
                      {getNotificationIcon(notificacao.tipo)}
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
                          fontWeight={notificacao.lida ? 500 : 700}
                          fontSize="0.95rem"
                          color="var(--text-primary)"
                        >
                          {notificacao.titulo}
                        </Typography>
                        {!notificacao.lida && (
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
                            {formatarData(notificacao.data)}
                          </Typography>
                          {userIsAdmin && notificacao.corretorNome && (
                            <>
                              <Typography
                                fontSize="0.75rem"
                                color="var(--text-tertiary)"
                              >
                                •
                              </Typography>
                              <Chip
                                label={notificacao.corretorNome}
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