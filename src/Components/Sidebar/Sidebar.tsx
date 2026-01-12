import {
  LayoutDashboard,
  Users,
  Shield,
  Car,
  UserCog,
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { useState, useEffect } from "react";
import { isAdmin } from "../../Utils/permissions";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    setIsAdminUser(isAdmin());
  }, []);

  return (
    <aside
      style={{
        width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        transition: 'var(--sidebar-transition)',
      }}
      className="
        h-screen
        bg-[var(--bg-sidebar)]
        border-r border-[var(--border-default)]
        flex flex-col
        shadow-lg
        relative
        overflow-hidden
      "
    >
      {/* Logo / Brand */}
      <div className="h-16 px-4 flex items-center justify-center border-b border-[var(--border-default)]">
        {isCollapsed ? (
          <button
            onClick={() => setIsCollapsed(false)}
            className="
              w-11 h-11
              bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)]
              hover:from-[var(--color-primary-hover)] hover:to-[var(--color-accent-dark)]
              text-white
              rounded-xl
              flex items-center justify-center
              transition-all duration-200
              shadow-lg
              hover:shadow-xl
              hover:scale-105
            "
            title="Expandir sidebar"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-base font-bold text-[var(--text-primary)] leading-tight truncate">
                  Vision Secure
                </span>
                <span className="text-[10px] text-[var(--text-muted)] leading-tight truncate">
                  Sistema de Seguros
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setIsCollapsed(true)}
              className="
                w-8 h-8 flex-shrink-0
                bg-[var(--bg-sidebar-hover)]
                hover:bg-[var(--color-primary)]
                hover:text-white
                rounded-lg
                flex items-center justify-center
                transition-all duration-200
              "
              title="Recolher sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className={`flex-1 px-3 py-6 space-y-2 overflow-y-auto ${isCollapsed ? 'sidebar-nav-collapsed' : 'sidebar-nav-expanded'}`}>
        <SidebarItem
          icon={LayoutDashboard}
          label="Dashboard"
          to="/dashboard"
          isCollapsed={isCollapsed}
        />

        <SidebarItem
          icon={Users}
          label="Segurados"
          isCollapsed={isCollapsed}
          subTabs={[
            { label: "Criar Segurado", to: "/segurados/criar", type: "create" },
            { label: "Listar Segurados", to: "/segurados/listar", type: "list" }
          ]}
        />

        <SidebarItem
          icon={Shield}
          label="Seguradoras"
          isCollapsed={isCollapsed}
          subTabs={[
            { label: "Criar Seguradora", to: "/seguradoras/criar", type: "create" },
            { label: "Listar Seguradoras", to: "/seguradoras/listar", type: "list" }
          ]}
        />

        <SidebarItem
          icon={Car}
          label="Veículos"
          isCollapsed={isCollapsed}
          subTabs={[
            { label: "Criar Veículo", to: "/veiculos/criar", type: "create" },
            { label: "Listar Veículos", to: "/veiculos/listar", type: "list" }
          ]}
        />

        {isAdminUser && (
          <SidebarItem
            icon={UserCog}
            label="Corretores"
            isCollapsed={isCollapsed}
            subTabs={[
              { label: "Criar Corretor", to: "/corretores/criar", type: "create" },
              { label: "Listar Corretores", to: "/corretores/listar", type: "list" }
            ]}
          />
        )}

        <SidebarItem
          icon={FileText}
          label="Seguros"
          isCollapsed={isCollapsed}
          subTabs={[
            { label: "Criar Seguro", to: "/seguros/criar", type: "create" },
            { label: "Listar Seguros", to: "/seguros/listar", type: "list" }
          ]}
        />
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[var(--border-default)]">
        {!isCollapsed ? (
          <div className="text-center">
            <p className="text-xs text-[var(--text-muted)] mb-1">
              © 2026 Vision Secure
            </p>
            <p className="text-[10px] text-[var(--text-muted)] opacity-70">
              v1.0.0
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-sidebar-hover)] flex items-center justify-center">
              <span className="text-xs font-bold text-[var(--color-primary)]">VS</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
