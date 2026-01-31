import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Tooltip,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import CloudDoneOutlinedIcon from "@mui/icons-material/CloudDoneOutlined";
import CloudOffOutlinedIcon from "@mui/icons-material/CloudOffOutlined";
import { logoutUser, getCorretorId } from "../../Services/auth";
import ModalNotificacao from "../Notificacoes/ModalNotificacao";
import { useNotificacoes } from "../../hooks/useNotificacoes";
import { verificarStatusBackend } from "../../Services/frappeClient";
import "../../Styles/theme.css"

type HeaderProps = {
  userName: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
};

export default function Header({
  userName,
  isDarkMode,
  onToggleTheme,
}: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [modalNotificacoesAberto, setModalNotificacoesAberto] = useState(false);
  const [sistemaAtivo, setSistemaAtivo] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const corretorId = getCorretorId();
  const { naoLidas, marcarComoLida } = useNotificacoes();

  // Verifica o status do backend
  useEffect(() => {
    const verificarStatus = async () => {
      const status = await verificarStatusBackend();
      setSistemaAtivo(status);
    };

    verificarStatus();
    const interval = setInterval(verificarStatus, 30000); // Verifica a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <header
      className="w-full h-16 px-4 md:px-6 flex items-center justify-between backdrop-blur-sm"
      style={{
        backgroundColor: "var(--bg-card)",
        borderBottom: "1px solid var(--border-default)",
        color: "var(--text-primary)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Nome da empresa */}
      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
              color: "var(--text-inverse)",
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
            }}
          >
            A
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tight">
            Asha Corretora
          </span>
        </div>

        {/* Status do Sistema */}
        {sistemaAtivo !== null && (
          <Tooltip 
            title={sistemaAtivo ? "Backend conectado e operacional" : "Backend desconectado - Verifique a conexão"} 
            arrow
            slotProps={{
              tooltip: {
                sx: {
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-default)",
                  boxShadow: "var(--shadow-md)",
                  fontSize: "0.75rem",
                  "& .MuiTooltip-arrow": {
                    color: "var(--bg-card)",
                    "&::before": {
                      border: "1px solid var(--border-default)",
                    }
                  }
                }
              }
            }}
          >
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-105" 
              style={{
                backgroundColor: sistemaAtivo 
                  ? "var(--color-success-bg)" 
                  : "var(--color-danger-bg)",
                border: `1px solid ${sistemaAtivo 
                  ? "var(--color-success)" 
                  : "var(--color-danger)"}`,
                boxShadow: sistemaAtivo 
                  ? "0 0 12px rgba(34, 197, 94, 0.2)" 
                  : "0 0 12px rgba(239, 68, 68, 0.2)",
              }}
            >
              {sistemaAtivo ? (
                <CloudDoneOutlinedIcon 
                  sx={{ 
                    fontSize: 16,
                    color: "var(--color-success)",
                  }} 
                />
              ) : (
                <CloudOffOutlinedIcon 
                  sx={{ 
                    fontSize: 16,
                    color: "var(--color-danger)",
                  }} 
                />
              )}
              <FiberManualRecordIcon 
                sx={{ 
                  fontSize: 10,
                  color: sistemaAtivo ? "var(--color-success)" : "var(--color-danger)",
                  animation: sistemaAtivo ? "pulse 2s ease-in-out infinite" : "none",
                  "@keyframes pulse": {
                    "0%, 100%": { 
                      opacity: 1,
                      transform: "scale(1)",
                    },
                    "50%": { 
                      opacity: 0.6,
                      transform: "scale(1.1)",
                    },
                  }
                }} 
              />
              <span 
                className="text-xs font-semibold tracking-wide hidden sm:inline" 
                style={{
                  color: sistemaAtivo ? "var(--color-success)" : "var(--color-danger)",
                }}
              >
                {sistemaAtivo ? "Ativo" : "Inativo"}
              </span>
            </div>
          </Tooltip>
        )}
      </div>

      {/* Ações */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Notificações */}
        <IconButton
          onClick={() => setModalNotificacoesAberto(true)}
          aria-label="Notificações"
          sx={{ 
            color: "var(--text-secondary)",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: "var(--button-secondary-hover)",
              color: "var(--text-primary)",
              transform: "scale(1.05)",
            }
          }}
        >
          <Badge
            badgeContent={naoLidas}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "var(--color-danger)",
                color: "var(--text-inverse)",
                fontWeight: 600,
                fontSize: "0.65rem",
                minWidth: "18px",
                height: "18px",
                boxShadow: "0 2px 4px rgba(220, 38, 38, 0.3)",
              },
            }}
          >
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>

        {/* Toggle tema */}
        <IconButton
          onClick={onToggleTheme}
          aria-label="Alternar tema"
          sx={{ 
            color: "var(--text-secondary)",
            transition: "all 0.2s",
            "&:hover": {
              backgroundColor: "var(--button-secondary-hover)",
              color: "var(--color-primary)",
              transform: "rotate(180deg)",
            }
          }}
        >
          {isDarkMode ? <WbSunnyOutlinedIcon /> : <DarkModeOutlinedIcon />}
        </IconButton>

        {/* Divisor */}
        <div 
          className="hidden md:block w-px h-6 mx-2"
          style={{ backgroundColor: "var(--border-default)" }}
        />

        {/* Usuário */}
        <button
          onClick={openMenu}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:scale-[1.02]"
          style={{
            color: "var(--text-primary)",
            backgroundColor: Boolean(anchorEl) ? "var(--button-secondary-hover)" : "transparent",
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, var(--color-primary-light), var(--color-primary))",
              color: "var(--text-inverse)",
              fontSize: 15,
              fontWeight: 600,
              border: "2px solid var(--bg-card)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>

          <span
            className="hidden md:block text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {userName}
          </span>
        </button>

        {/* Menu do usuário */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeMenu}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
              boxShadow: "var(--shadow-md)",
              borderRadius: 2,
              "& .MuiMenuItem-root": {
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "var(--button-secondary-hover)",
                }
              }
            },
          }}
        >
          <MenuItem
            onClick={() => {
              closeMenu();
              navigate("/configuracoes");
            }}
          >
            <PersonOutlineIcon fontSize="small" className="mr-2" />
            Configurações
          </MenuItem>

          <MenuItem
            onClick={() => {
              closeMenu();
              handleLogout();
            }}
            sx={{
              color: "var(--color-danger) !important",
            }}
          >
            <LogoutIcon fontSize="small" className="mr-2" />
            Sair
          </MenuItem>
        </Menu>
      </div>

      {/* Modal de Notificações */}
      <ModalNotificacao
        open={modalNotificacoesAberto}
        onClose={() => setModalNotificacoesAberto(false)}
        corretorId={corretorId}
        onMarcarComoLida={marcarComoLida}
      />
    </header>
  );
}
