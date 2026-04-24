"use client";

import { useQuery } from "@tanstack/react-query";
import { Users, TrendingUp, DollarSign, Target, BarChart2 } from "lucide-react";
import { reportsService } from "@/services/reports.service";
import { Card } from "@/components/ui/card";
import { FUNNEL_STAGES, LEAD_ORIGINS, type FunnelStage, type LeadOrigin } from "@/types";
import { getKanbanColumnColor, getStageBadgeStyle, formatCurrency, cn } from "@/lib/utils";

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <Card className="p-4 border-[var(--border)] bg-[var(--card)] space-y-1">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: color + "18" }}>
        <Icon size={18} style={{ color }} />
      </div>
      <p className="text-2xl font-bold text-[var(--foreground)]">{value}</p>
      <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
      {sub && <p className="text-xs text-[var(--muted-foreground)]">{sub}</p>}
    </Card>
  );
}

export default function RelatoriosPage() {
  const { data: summary, isLoading } = useQuery({
    queryKey: ["reports-summary"],
    queryFn: reportsService.summary,
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-5 animate-pulse">
        <div className="h-7 bg-[var(--muted)] rounded w-40" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-[var(--muted)] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const byStage = summary?.byStage ?? {};
  const byOrigin = summary?.byOrigin ?? {};
  const totalLeads = summary?.totalLeads ?? 0;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Relatórios</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">Análise do seu negócio</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Users}
          label="Total de Leads"
          value={summary?.totalLeads ?? 0}
          sub={`+${summary?.newLeadsThisMonth ?? 0} este mês`}
          color="var(--primary)"
        />
        <StatCard
          icon={TrendingUp}
          label="Fechados"
          value={summary?.closedLeads ?? 0}
          color="var(--success)"
        />
        <StatCard
          icon={Target}
          label="Conversão"
          value={`${summary?.conversionRate ?? 0}%`}
          color="var(--warning)"
        />
        <StatCard
          icon={DollarSign}
          label="Receita Total"
          value={formatCurrency(summary?.totalRevenue ?? 0)}
          color="#8b5cf6"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* By Stage */}
        <div className="space-y-2">
          <h2 className="font-bold text-[var(--foreground)]">Por Etapa do Funil</h2>
          <Card className="border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
            {FUNNEL_STAGES.map((stage) => {
              const stageKey = stage.toLowerCase().replace(/ /g, "_");
              const count = byStage[stage] ?? byStage[stageKey] ?? 0;
              const pct = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
              const color = getKanbanColumnColor(stage);
              const badge = getStageBadgeStyle(stage);
              return (
                <div key={stage} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", badge.bg, badge.text)}>
                      {stage}
                    </span>
                    <span className="text-sm font-bold text-[var(--foreground)]">{count}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </Card>
        </div>

        {/* By Origin */}
        <div className="space-y-2">
          <h2 className="font-bold text-[var(--foreground)]">Por Origem</h2>
          <Card className="border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
            {LEAD_ORIGINS.map((origin) => {
              const key = origin.toLowerCase().replace(/ /g, "_").replace("ã", "a").replace("á", "a");
              const count = byOrigin[origin] ?? byOrigin[key] ?? 0;
              if (count === 0) return null;
              const pct = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
              return (
                <div key={origin} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--foreground)]">{origin}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[var(--text-secondary)]">{pct.toFixed(0)}%</span>
                      <span className="text-sm font-bold text-[var(--foreground)]">{count}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--primary)] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>

      {/* Weekly trend */}
      {summary?.weeklyTrend && summary.weeklyTrend.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-bold text-[var(--foreground)]">Tendência Semanal</h2>
          <Card className="border-[var(--border)] bg-[var(--card)] p-4">
            <div className="flex items-end gap-2 h-24">
              {summary.weeklyTrend.map((item, i) => {
                const max = Math.max(...summary.weeklyTrend.map((t) => t.count), 1);
                const height = (item.count / max) * 100;
                const date = new Date(item.date);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-[var(--muted-foreground)] font-medium">
                      {item.count}
                    </span>
                    <div className="w-full rounded-t-md bg-[var(--primary)] transition-all" style={{ height: `${height}%`, minHeight: item.count > 0 ? "4px" : "0" }} />
                    <span className="text-[9px] text-[var(--muted-foreground)]">
                      {date.toLocaleDateString("pt-BR", { weekday: "short" })}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
