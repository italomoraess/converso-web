"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  Users,
  TrendingUp,
  Clock,
  Calendar,
  UserPlus,
  Kanban,
  BarChart2,
  MessageCircle,
  Phone,
  MapPin,
  FileText,
  CheckSquare,
  Check,
} from "lucide-react";
import { leadsService } from "@/services/leads.service";
import { appointmentsService } from "@/services/appointments.service";
import { Card } from "@/components/ui/card";
import {
  greeting,
  todayISO,
  getStageBadgeStyle,
  getOriginBadgeStyle,
  getWhatsAppUrl,
  getInitials,
  cn,
} from "@/lib/utils";
import type { Lead, Task } from "@/types";

const FUNNEL_STAGES = [
  { label: "Novo Lead", color: "#1a56db" },
  { label: "Em Contato", color: "#f59e0b" },
  { label: "Proposta Enviada", color: "#8b5cf6" },
  { label: "Em Negociação", color: "#ec4899" },
  { label: "Fechado ✓", stage: "Fechado", color: "#10b981" },
  { label: "Perdido", color: "#6b7280" },
];

const TASK_TYPE_ICONS: Record<string, React.ElementType> = {
  Ligação: Phone,
  Visita: MapPin,
  Reunião: Users,
  "Retornar proposta": FileText,
  Outro: CheckSquare,
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  href?: string;
}) {
  const content = (
    <Card className="p-4 space-y-1 bg-[var(--card)] border-[var(--border)] hover:shadow-md transition-shadow cursor-pointer">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
        style={{ backgroundColor: color + "18" }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <p className="text-2xl font-bold text-[var(--foreground)]">{value}</p>
      <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
      {sub && <p className="text-xs text-[var(--muted-foreground)]">{sub}</p>}
    </Card>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

function QuickAction({
  icon: Icon,
  label,
  color,
  href,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center gap-2 p-3 bg-[var(--card)] border border-[var(--border)] rounded-xl hover:shadow-md transition-shadow cursor-pointer">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: color + "18" }}
        >
          <Icon size={22} style={{ color }} />
        </div>
        <span className="text-xs font-medium text-[var(--foreground)] text-center leading-tight">
          {label}
        </span>
      </div>
    </Link>
  );
}

function TodayTaskRow({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: (id: string) => void;
}) {
  const Icon = TASK_TYPE_ICONS[task.type] ?? CheckSquare;
  return (
    <button
      onClick={() => onToggle(task.id)}
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-b border-[var(--border-light)] w-full text-left last:border-0 hover:bg-[var(--muted)]/50 transition-colors",
        task.completed && "opacity-50"
      )}
    >
      <div
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
          task.completed
            ? "bg-[var(--success)] border-[var(--success)]"
            : "border-[var(--border)]"
        )}
      >
        {task.completed && <Check size={11} color="#fff" />}
      </div>
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: "var(--primary)" + "18" }}
      >
        <Icon size={13} style={{ color: "var(--primary)" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium text-[var(--foreground)] truncate",
            task.completed && "line-through text-[var(--muted-foreground)]"
          )}
        >
          {task.title}
        </p>
        {task.leadName && (
          <p className="text-xs text-[var(--primary)] truncate">{task.leadName}</p>
        )}
      </div>
    </button>
  );
}

function RecentLeadRow({ lead }: { lead: Lead }) {
  const badge = getStageBadgeStyle(lead.stage);
  const origin = getOriginBadgeStyle(lead.origem);
  const initials = getInitials(lead.nome);

  return (
    <Link
      href={`/leads/${lead.id}`}
      className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-light)] last:border-0 hover:bg-[var(--muted)]/50 transition-colors"
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-[var(--primary)]/10">
        <span className="text-sm font-bold text-[var(--primary)]">{initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--foreground)] truncate">{lead.nome}</p>
        <div className="flex gap-1.5 mt-0.5">
          <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", origin.bg, origin.text)}>
            {lead.origem}
          </span>
          <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", badge.bg, badge.text)}>
            {badge.label}
          </span>
        </div>
      </div>
      <a
        href={getWhatsAppUrl(lead.telefone)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="w-8 h-8 rounded-full bg-[#25d366] flex items-center justify-center shrink-0 hover:opacity-90"
      >
        <MessageCircle size={14} color="#fff" />
      </a>
    </Link>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const qc = useQueryClient();

  const { data: leads = [] } = useQuery({
    queryKey: ["leads"],
    queryFn: leadsService.list,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => appointmentsService.list(),
  });

  const completeMutation = useMutation({
    mutationFn: appointmentsService.complete,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const today = todayISO();
  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const thisMonthLeads = useMemo(() => {
    const from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    return leads.filter((l) => l.createdAt >= from);
  }, [leads, now]);

  const closedLeads = leads.filter((l) => l.stage === "Fechado");
  const newLeads = leads.filter((l) => l.stage === "Novo Lead").length;
  const convRate =
    leads.length > 0 ? Math.round((closedLeads.length / leads.length) * 100) : 0;

  const todayTasks = useMemo(
    () => tasks.filter((t) => !t.completed && t.date.slice(0, 10) === today),
    [tasks, today]
  );

  const recentLeads = useMemo(
    () => [...leads].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5),
    [leads]
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          {greeting()}, {user?.name?.split(" ")[0] ?? ""}! 👋
        </h1>
        <p className="text-sm text-[var(--text-secondary)] capitalize mt-0.5">{dateStr}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Total Leads" value={leads.length} sub={`+${thisMonthLeads.length} este mês`} color="var(--primary)" href="/leads" />
        <StatCard icon={TrendingUp} label="Fechados" value={closedLeads.length} sub={`${convRate}% conversão`} color="var(--success)" href="/kanban" />
        <StatCard icon={Clock} label="Novos" value={newLeads} sub="aguardando contato" color="var(--warning)" href="/kanban" />
        <StatCard icon={Calendar} label="Tarefas Hoje" value={todayTasks.length} sub={todayTasks.length === 0 ? "nenhuma pendente" : "pendentes"} color={todayTasks.length > 0 ? "var(--danger)" : "var(--success)"} href="/agenda" />
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-[var(--foreground)]">Ações Rápidas</h2>
        <div className="grid grid-cols-4 gap-2">
          <QuickAction icon={UserPlus} label="Novo Lead" color="var(--primary)" href="/leads/new" />
          <QuickAction icon={Calendar} label="Nova Tarefa" color="var(--secondary)" href="/agenda?new=1" />
          <QuickAction icon={Kanban} label="Ver Funil" color="#8b5cf6" href="/kanban" />
          <QuickAction icon={BarChart2} label="Relatórios" color="var(--success)" href="/relatorios" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {todayTasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[var(--foreground)]">Tarefas de Hoje</h2>
              <Link href="/agenda" className="text-xs font-medium text-[var(--primary)] hover:underline">Ver todas</Link>
            </div>
            <Card className="border-[var(--border)] bg-[var(--card)] overflow-hidden">
              {todayTasks.slice(0, 4).map((t) => (
                <TodayTaskRow key={t.id} task={t} onToggle={(id) => completeMutation.mutate(id)} />
              ))}
              {todayTasks.length > 4 && (
                <Link href="/agenda" className="block px-4 py-3 text-center text-sm font-medium text-[var(--primary)] hover:bg-[var(--muted)]/50 transition-colors">
                  +{todayTasks.length - 4} mais tarefas
                </Link>
              )}
            </Card>
          </div>
        )}

        <div className="space-y-2">
          <h2 className="text-base font-bold text-[var(--foreground)]">Funil de Vendas</h2>
          <Card className="border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
            {FUNNEL_STAGES.map((item) => {
              const stageName = item.stage ?? item.label;
              const count = leads.filter((l) => l.stage === stageName).length;
              const pct = leads.length > 0 ? (count / leads.length) * 100 : 0;
              return (
                <Link key={item.label} href="/kanban" className="flex items-center gap-3 group">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="w-36 text-sm text-[var(--foreground)] truncate">{item.label}</span>
                  <div className="flex-1 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(pct, pct > 0 ? 3 : 0)}%`, backgroundColor: item.color }} />
                  </div>
                  <span className="text-sm font-semibold text-[var(--text-secondary)] w-5 text-right">{count}</span>
                </Link>
              );
            })}
          </Card>
        </div>
      </div>

      {recentLeads.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--foreground)]">Leads Recentes</h2>
            <Link href="/leads" className="text-xs font-medium text-[var(--primary)] hover:underline">Ver todos</Link>
          </div>
          <Card className="border-[var(--border)] bg-[var(--card)] overflow-hidden">
            {recentLeads.map((l) => <RecentLeadRow key={l.id} lead={l} />)}
          </Card>
        </div>
      )}

      {leads.length === 0 && (
        <Card className="border-[var(--border)] bg-[var(--card)] p-10 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
            <Users size={32} style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">Comece pelo primeiro lead</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-xs">
              Cadastre seus contatos e acompanhe cada oportunidade de venda em um só lugar.
            </p>
          </div>
          <Link href="/leads/new" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm hover:bg-[var(--primary-dark)] transition-colors">
            <UserPlus size={16} />
            Adicionar primeiro lead
          </Link>
        </Card>
      )}
    </div>
  );
}
