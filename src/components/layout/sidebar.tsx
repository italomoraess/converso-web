"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Home,
  Users,
  Kanban,
  Calendar,
  Package,
  DollarSign,
  BarChart2,
  LogOut,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Início" },
  { href: "/leads", icon: Users, label: "Leads" },
  { href: "/kanban", icon: Kanban, label: "Funil" },
  { href: "/agenda", icon: Calendar, label: "Agenda" },
  { href: "/financeiro", icon: DollarSign, label: "Financeiro" },
  { href: "/catalogo", icon: Package, label: "Catálogo" },
  { href: "/relatorios", icon: BarChart2, label: "Relatórios" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  const user = session?.user;
  const initials = getInitials(user?.name ?? undefined, user?.email ?? undefined);

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-[var(--card)] border-r border-[var(--border)] transition-all duration-200 shrink-0",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center gap-2.5 px-4 py-5 border-b border-[var(--border)]",
          collapsed && "justify-center px-2"
        )}
      >
        <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shrink-0">
          <Zap size={16} color="#fff" />
        </div>
        {!collapsed && (
          <span className="font-bold text-[var(--foreground)] text-base tracking-tight">
            Converso
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--border)] p-2 space-y-0.5">
        <Link
          href="/perfil"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors w-full",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Perfil" : undefined}
        >
          <Avatar className="w-7 h-7 shrink-0">
            <AvatarFallback className="text-xs bg-[var(--primary)]/15 text-[var(--primary)] font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--foreground)] truncate">
                {user?.name || user?.email || "Usuário"}
              </p>
              {user?.name && (
                <p className="text-[10px] text-[var(--muted-foreground)] truncate">
                  {user.email}
                </p>
              )}
            </div>
          )}
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 transition-colors w-full",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Sair" : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>

        <button
          onClick={() => setCollapsed((v) => !v)}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors w-full",
            collapsed && "justify-center px-2"
          )}
        >
          {collapsed ? (
            <ChevronRight size={14} />
          ) : (
            <>
              <ChevronLeft size={14} />
              <span>Recolher</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
