"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Inbox, MessageCircle } from "lucide-react";
import { leadsService } from "@/services/leads.service";
import { stageToApi } from "@/lib/mappers";
import { FUNNEL_STAGES, type FunnelStage, type Lead } from "@/types";
import { getOriginBadgeStyle, getKanbanColumnColor, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

function KanbanCard({
  lead,
  onMoveStage,
}: {
  lead: Lead;
  onMoveStage: (lead: Lead, stage: FunnelStage) => void;
}) {
  const origin = getOriginBadgeStyle(lead.origem);

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 space-y-2 shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/leads/${lead.id}`}>
        <p className="text-sm font-semibold text-[var(--foreground)] truncate hover:text-[var(--primary)]">
          {lead.nome}
        </p>
        <p className="text-xs text-[var(--text-secondary)]">{lead.telefone}</p>
        {lead.origem && (
          <span className={cn("inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1", origin.bg, origin.text)}>
            {lead.origem}
          </span>
        )}
        {lead.stage === "Perdido" && lead.motivoPerdido && (
          <p className="text-xs italic text-[var(--danger)] mt-1 truncate">{lead.motivoPerdido}</p>
        )}
      </Link>

      {/* Move stage pills */}
      <div className="flex flex-wrap gap-1">
        {FUNNEL_STAGES.filter((s) => s !== lead.stage).map((s) => {
          const color = getKanbanColumnColor(s);
          return (
            <button
              key={s}
              onClick={() => onMoveStage(lead, s)}
              style={{ borderColor: color, color }}
              className="text-[9px] font-medium border rounded-full px-1.5 py-0.5 hover:opacity-80 transition-opacity truncate max-w-[80px]"
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function KanbanPage() {
  const qc = useQueryClient();
  const [lostModal, setLostModal] = useState<{ lead: Lead; targetStage: FunnelStage } | null>(null);
  const [motivoPerdido, setMotivoPerdido] = useState("");

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: leadsService.list,
  });

  const stageMutation = useMutation({
    mutationFn: ({ id, stage, reason }: { id: string; stage: string; reason?: string }) =>
      leadsService.updateStage(id, stage, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Etapa atualizada!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function handleMoveStage(lead: Lead, stage: FunnelStage) {
    if (stage === "Perdido") {
      setLostModal({ lead, targetStage: stage });
      setMotivoPerdido("");
      return;
    }
    stageMutation.mutate({ id: lead.id, stage: stageToApi[stage] });
  }

  function confirmLost() {
    if (!lostModal) return;
    stageMutation.mutate(
      { id: lostModal.lead.id, stage: "perdido", reason: motivoPerdido },
      {
        onSettled: () => {
          setLostModal(null);
          setMotivoPerdido("");
        },
      }
    );
  }

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Funil de Vendas</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
          {leads.length} leads no funil
        </p>
      </div>

      {/* Board */}
      <div className="flex gap-3 overflow-x-auto pb-4 flex-1">
        {FUNNEL_STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage);
          const color = getKanbanColumnColor(stage);
          return (
            <div
              key={stage}
              className="flex-shrink-0 w-56 flex flex-col gap-2 bg-[var(--muted)] rounded-2xl p-3"
            >
              {/* Column header */}
              <div className="flex items-center justify-between border-l-[3px] pl-2" style={{ borderLeftColor: color }}>
                <span className="text-sm font-semibold text-[var(--foreground)] truncate">{stage}</span>
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ backgroundColor: color }}
                >
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 overflow-y-auto">
                {isLoading ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-20 bg-[var(--card)] rounded-xl animate-pulse" />
                  ))
                ) : stageLeads.length === 0 ? (
                  <div className="flex flex-col items-center gap-1 py-6 text-[var(--muted-foreground)]">
                    <Inbox size={20} />
                    <span className="text-xs">Vazio</span>
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <KanbanCard key={lead.id} lead={lead} onMoveStage={handleMoveStage} />
                  ))
                )}
              </div>

              {stage === "Perdido" && stageLeads.length > 0 && (
                <Link
                  href="/perdidos"
                  className="text-xs font-medium text-[var(--danger)] border border-[var(--danger)] rounded-lg py-1.5 text-center hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                >
                  Ver {stageLeads.length} perdido(s)
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Lost reason modal */}
      <Dialog open={!!lostModal} onOpenChange={() => setLostModal(null)}>
        <DialogContent className="bg-[var(--card)] border-[var(--border)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--foreground)]">Marcar como Perdido</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[var(--text-secondary)]">
            Qual o motivo da perda? (opcional)
          </p>
          <Input
            placeholder="Ex: preço, sem interesse, concorrência..."
            value={motivoPerdido}
            onChange={(e) => setMotivoPerdido(e.target.value)}
            className="bg-[var(--background)] border-[var(--border)]"
          />
          <div className="flex gap-3 mt-2">
            <Button
              variant="outline"
              onClick={() => setLostModal(null)}
              className="flex-1 border-[var(--border)]"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmLost}
              disabled={stageMutation.isPending}
              className="flex-1 bg-[var(--danger)] hover:bg-red-600 text-white"
            >
              {stageMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Confirmar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
