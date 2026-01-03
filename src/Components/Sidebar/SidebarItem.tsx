import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  isCollapsed?: boolean;
}

export function SidebarItem({ icon: Icon, label, to, isCollapsed = false }: SidebarItemProps) {
  return (
    <NavLink
      to={to}
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
