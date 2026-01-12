import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { logoutUser } from "../../Services/auth";
import "../../Styles/theme.css"

type HeaderProps = {
  userName: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  notificationsCount?: number;
};

export default function Header({
  userName,
  isDarkMode,
  onToggleTheme,
  notificationsCount = 0,
}: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

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

      {/* Ações */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Notificações */}
        <IconButton
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
            badgeContent={notificationsCount}
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
          <MenuItem onClick={closeMenu}>
            <PersonOutlineIcon fontSize="small" className="mr-2" />
            Meu perfil
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
    </header>
  );
}
