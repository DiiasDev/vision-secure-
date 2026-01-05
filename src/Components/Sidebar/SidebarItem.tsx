import { NavLink, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ChevronDown, Plus, List } from "lucide-react";
import { useState, useEffect } from "react";

interface SubTab {
  label: string;
  to: string;
  type: "create" | "list";
}

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  to?: string;
  isCollapsed?: boolean;
  subTabs?: SubTab[];
}

export function SidebarItem({ 
  icon: Icon, 
  label, 
  to, 
  isCollapsed = false,
  subTabs 
}: SidebarItemProps) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubTabs = subTabs && subTabs.length > 0;

  const isAnySubTabActive = hasSubTabs ? subTabs.some(sub => 
    location.pathname === sub.to
  ) : false;

  // Auto-expandir quando uma subtab está ativa
  useEffect(() => {
    if (isAnySubTabActive && !isCollapsed) {
      setIsExpanded(true);
    }
  }, [isAnySubTabActive, isCollapsed]);

  // Se não tem subtabs, renderiza o item simples
  if (!hasSubTabs) {
    return (
      <NavLink
        to={to!}
        end
        title={isCollapsed ? label : undefined}
        className={({ isActive }) =>
          `
          group relative flex items-center
          ${isCollapsed ? "justify-center px-0 w-full" : "gap-3 px-3"}
          py-2.5 rounded-xl
          text-sm font-medium
          transition-all duration-200
          ${
            isActive
              ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white shadow-lg shadow-[var(--color-primary)]/25"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-sidebar-hover)] hover:text-[var(--text-primary)]"
          }
          `
        }
      >
        {({ isActive }) => (
          <>
            <div className={`
              ${isCollapsed ? "w-11 h-11" : "w-9 h-9"} 
              flex items-center justify-center rounded-lg
              transition-all duration-200
              ${isActive 
                ? "bg-white/20" 
                : "group-hover:bg-[var(--color-primary)]/10"
              }
            `}>
              <Icon
                size={isCollapsed ? 22 : 20}
                strokeWidth={2.5}
                className={`
                  transition-all duration-200
                  ${isActive ? "text-white" : "text-inherit group-hover:text-[var(--color-primary)]"}
                `}
              />
            </div>
            
            {!isCollapsed && (
              <span className="whitespace-nowrap overflow-hidden font-medium">
                {label}
              </span>
            )}
            
            {/* Active indicator */}
            {isActive && !isCollapsed && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div
                className="
                  absolute left-full ml-6 px-3 py-2
                  bg-[var(--bg-card)] text-[var(--text-primary)]
                  text-sm font-semibold rounded-lg
                  shadow-xl border border-[var(--border-default)]
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible
                  transition-all duration-200
                  whitespace-nowrap
                  z-50
                  pointer-events-none
                "
              >
                {label}
                <div
                  className="
                    absolute right-full top-1/2 -translate-y-1/2 -mr-1
                    w-0 h-0
                    border-y-[6px] border-y-transparent
                    border-r-[6px] border-r-[var(--bg-card)]
                  "
                />
              </div>
            )}
          </>
        )}
      </NavLink>
    );
  }

  // Item com subtabs
  const handleToggle = () => {
    if (!isCollapsed) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="space-y-1">
      {/* Parent Tab */}
      <button
        onClick={handleToggle}
        disabled={isCollapsed}
        className={`
          group relative flex items-center w-full
          ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"}
          py-3 rounded-xl
          text-sm font-semibold
          transition-all duration-300 ease-out
          ${
            isAnySubTabActive
              ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white shadow-lg shadow-[var(--color-primary)]/30 scale-[1.02]"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-sidebar-hover)] hover:text-[var(--color-primary)] hover:scale-[1.01]"
          }
          ${isCollapsed ? "cursor-default" : "cursor-pointer"}
        `}
      >
        <div className={`
          ${isCollapsed ? "w-11 h-11" : "w-10 h-10"} 
          flex items-center justify-center rounded-xl
          transition-all duration-300
          ${isAnySubTabActive
            ? "bg-white/20 shadow-inner" 
            : "bg-[var(--color-primary)]/5 group-hover:bg-[var(--color-primary)]/15 group-hover:scale-110"
          }
        `}>
          <Icon
            size={isCollapsed ? 22 : 20}
            strokeWidth={2.5}
            className={`
              transition-all duration-300
              ${isAnySubTabActive ? "text-white" : "text-[var(--color-primary)] group-hover:text-[var(--color-primary)]"}
            `}
          />
        </div>
        
        {!isCollapsed && (
          <>
            <span className="whitespace-nowrap overflow-hidden font-semibold flex-1 text-left tracking-wide">
              {label}
            </span>
            <div className={`
              p-1 rounded-lg transition-all duration-300
              ${isAnySubTabActive ? "bg-white/20" : "bg-[var(--color-primary)]/10 group-hover:bg-[var(--color-primary)]/20"}
            `}>
              <ChevronDown
                size={16}
                strokeWidth={2.5}
                className={`
                  transition-transform duration-300
                  ${isExpanded ? "rotate-180" : "rotate-0"}
                  ${isAnySubTabActive ? "text-white" : "text-[var(--color-primary)]"}
                `}
              />
            </div>
          </>
        )}
        
        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div
            className="
              absolute left-full ml-6 px-3 py-2
              bg-[var(--bg-card)] text-[var(--text-primary)]
              text-sm font-semibold rounded-lg
              shadow-xl border border-[var(--border-default)]
              opacity-0 invisible group-hover:opacity-100 group-hover:visible
              transition-all duration-200
              whitespace-nowrap
              z-50
              pointer-events-none
            "
          >
            {label}
            <div className="text-xs text-[var(--text-muted)] mt-1">
              (Expanda para ver opções)
            </div>
            <div
              className="
                absolute right-full top-1/2 -translate-y-1/2 -mr-1
                w-0 h-0
                border-y-[6px] border-y-transparent
                border-r-[6px] border-r-[var(--bg-card)]
              "
            />
          </div>
        )}
      </button>

      {/* SubTabs - só aparecem se não estiver colapsado */}
      {!isCollapsed && isExpanded && (
        <div 
          className="
            ml-4 pl-4 space-y-1.5
            border-l-[3px] border-[var(--color-primary)]/40
            animate-in slide-in-from-top-2 duration-300
          "
        >
          {subTabs.map((subTab) => {
            const SubIcon = subTab.type === "create" ? Plus : List;
            return (
              <NavLink
                key={subTab.to}
                to={subTab.to}
                end
                className={({ isActive }) =>
                  `
                  group relative flex items-center gap-3
                  pl-3 pr-3 py-2.5 rounded-xl
                  text-sm font-medium
                  transition-all duration-300 ease-out
                  ${
                    isActive
                      ? "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] text-white shadow-lg shadow-[var(--color-accent)]/30 scale-[1.02] translate-x-1"
                      : "text-[var(--text-secondary)] hover:bg-gradient-to-r hover:from-[var(--bg-sidebar-hover)] hover:to-transparent hover:text-[var(--color-accent)] hover:translate-x-1 hover:shadow-sm"
                  }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`
                      w-7 h-7 flex items-center justify-center rounded-lg
                      transition-all duration-300
                      ${isActive 
                        ? "bg-white/25 shadow-inner scale-110" 
                        : "bg-[var(--color-accent)]/10 group-hover:bg-[var(--color-accent)]/20 group-hover:scale-110"
                      }
                    `}>
                      <SubIcon
                        size={15}
                        strokeWidth={2.5}
                        className={`
                          transition-all duration-300
                          ${isActive ? "text-white" : "text-[var(--color-accent)] group-hover:text-[var(--color-accent)]"}
                        `}
                      />
                    </div>
                    <span className="whitespace-nowrap overflow-hidden font-medium tracking-wide flex-1">
                      {subTab.label}
                    </span>
                    {isActive && (
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <div className="w-1 h-1 rounded-full bg-white/60 animate-pulse delay-75" />
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}
