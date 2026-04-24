"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, X, Plus, MessageCircle, Trash2, Users } from "lucide-react";
import { leadsService } from "@/services/leads.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getStageBadgeStyle,
  getOriginBadgeStyle,
  getWhatsAppUrl,
  getInitials,
  cn,
} from "@/lib/utils";
import { LEAD_ORIGIN_LABELS } from "@/types";
import type { Lead } from "@/types";
import { toast } from "sonner";

function LeadRow({ lead, onDelete }: { lead: Lead; onDelete: (id: string) => void }) {
  const badge = getStageBadgeStyle(lead.stage);
  const origin = getOriginBadgeStyle(lead.origin);
  const initials = getInitials(lead.name);

  return (
    <Link
      href={`/leads/${lead.id}`}
      className="flex items-center gap-4 px-5 py-4 border-b border-[var(--border-light)] last:border-0 hover:bg-[var(--muted)]/40 transition-colors group"
    >
      <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
        <span className="text-sm font-bold text-[var(--primary)]">{initials}</span>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--foreground)] truncate">{lead.name}</p>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">{lead.phone}</p>
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap", origin.bg, origin.text)}>
          {LEAD_ORIGIN_LABELS[lead.origin]}
        </span>
        <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap", badge.bg, badge.text)}>
          {badge.label}
        </span>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <a
          href={getWhatsAppUrl(lead.phone)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="w-8 h-8 rounded-full bg-[#25d366] flex items-center justify-center hover:opacity-90"
        >
          <MessageCircle size={14} color="#fff" />
        </a>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(lead.id);
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </Link>
  );
}

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const qc = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: leadsService.list,
  });

  const deleteMutation = useMutation({
    mutationFn: leadsService.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead removido.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return leads;
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.origin.toLowerCase().includes(q)
    );
  }, [leads, search]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Leads</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {leads.length} contatos cadastrados
          </p>
        </div>
        <Link href="/leads/new">
          <Button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white gap-2">
            <Plus size={16} />
            Novo Lead
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
        <Input
          placeholder="Buscar por nome, telefone ou origem..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-9 bg-[var(--card)] border-[var(--border)]"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isLoading ? (
        <Card className="border-[var(--border)] bg-[var(--card)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[var(--border-light)] last:border-0 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-[var(--muted)]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-[var(--muted)] rounded w-1/3" />
                <div className="h-2.5 bg-[var(--muted)] rounded w-1/4" />
              </div>
            </div>
          ))}
        </Card>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-[var(--muted)] flex items-center justify-center">
            <Users size={24} className="text-[var(--muted-foreground)]" />
          </div>
          <div>
            <p className="font-semibold text-[var(--foreground)]">
              {search ? "Nenhum lead encontrado" : "Nenhum lead ainda"}
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {search ? "Tente outra busca" : "Adicione seu primeiro lead"}
            </p>
          </div>
          {!search && (
            <Link href="/leads/new">
              <Button className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white gap-2">
                <Plus size={16} />
                Adicionar Lead
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <Card className="border-[var(--border)] bg-[var(--card)] overflow-hidden">
          {filtered.map((lead) => (
            <LeadRow
              key={lead.id}
              lead={lead}
              onDelete={(id) => {
                if (confirm("Remover este lead?")) deleteMutation.mutate(id);
              }}
            />
          ))}
        </Card>
      )}
    </div>
  );
}
