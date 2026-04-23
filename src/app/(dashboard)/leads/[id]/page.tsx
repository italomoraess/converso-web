"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Save,
  Trash2,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Calendar,
} from "lucide-react";
import { leadsService } from "@/services/leads.service";
import { localLeadToApi, stageToApi } from "@/lib/mappers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LEAD_ORIGINS, FUNNEL_STAGES, type FunnelStage, type LeadOrigin } from "@/types";
import { getStageBadgeStyle, getWhatsAppUrl, formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const qc = useQueryClient();

  const { data: lead, isLoading } = useQuery({
    queryKey: ["lead", id],
    queryFn: () => leadsService.getById(id),
  });

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [origem, setOrigem] = useState<LeadOrigin>("Instagram");
  const [stage, setStage] = useState<FunnelStage>("Novo Lead");
  const [localizacao, setLocalizacao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [vendaRecorrente, setVendaRecorrente] = useState(false);
  const [dealValue, setDealValue] = useState("");
  const [motivoPerdido, setMotivoPerdido] = useState("");

  useEffect(() => {
    if (lead) {
      setNome(lead.nome);
      setTelefone(lead.telefone);
      setEmail(lead.email ?? "");
      setOrigem(lead.origem);
      setStage(lead.stage);
      setLocalizacao(lead.localizacao ?? "");
      setObservacoes(lead.observacoes ?? "");
      setVendaRecorrente(lead.vendaRecorrente);
      setDealValue(lead.dealValue?.toString() ?? "");
      setMotivoPerdido(lead.motivoPerdido ?? "");
    }
  }, [lead]);

  const updateMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) => leadsService.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      qc.invalidateQueries({ queryKey: ["lead", id] });
      toast.success("Lead atualizado!");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: () => leadsService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead removido.");
      router.push("/leads");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = localLeadToApi({
      nome: nome.trim(),
      telefone: telefone.trim(),
      email: email.trim() || undefined,
      origem,
      stage,
      localizacao: localizacao.trim() || undefined,
      observacoes: observacoes.trim() || undefined,
      vendaRecorrente,
      dealValue: dealValue ? parseFloat(dealValue) : undefined,
      motivoPerdido: stage === "Perdido" ? motivoPerdido : undefined,
    });
    updateMutation.mutate(body);
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-5 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--muted)]" />
          <div className="h-6 bg-[var(--muted)] rounded w-1/3" />
        </div>
        <div className="h-64 bg-[var(--muted)] rounded-2xl" />
      </div>
    );
  }

  if (!lead) return null;

  const badge = getStageBadgeStyle(lead.stage);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--muted)] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">{lead.nome}</h1>
            <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", badge.bg, badge.text)}>
              {badge.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={getWhatsAppUrl(lead.telefone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25d366] text-white text-sm font-medium hover:opacity-90"
          >
            <MessageCircle size={15} />
            WhatsApp
          </a>
          <button
            onClick={() => {
              if (confirm("Remover este lead?")) deleteMutation.mutate();
            }}
            disabled={deleteMutation.isPending}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Quick info */}
      <Card className="border-[var(--border)] bg-[var(--card)] p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Phone size={14} className="text-[var(--muted-foreground)]" />
            <span className="text-[var(--foreground)] truncate">{lead.telefone}</span>
          </div>
          {lead.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail size={14} className="text-[var(--muted-foreground)]" />
              <span className="text-[var(--foreground)] truncate">{lead.email}</span>
            </div>
          )}
          {lead.localizacao && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={14} className="text-[var(--muted-foreground)]" />
              <span className="text-[var(--foreground)] truncate">{lead.localizacao}</span>
            </div>
          )}
          {lead.dealValue && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[var(--muted-foreground)] font-bold text-xs">R$</span>
              <span className="text-[var(--foreground)] font-semibold">
                {formatCurrency(lead.dealValue)}
              </span>
            </div>
          )}
        </div>
        {lead.vendaRecorrente && (
          <div className="flex items-center gap-1.5 mt-2">
            <RefreshCw size={12} className="text-[var(--success)]" />
            <span className="text-xs text-[var(--success)] font-medium">Venda recorrente</span>
          </div>
        )}
        {lead.observacoes && (
          <p className="text-sm text-[var(--text-secondary)] mt-3 border-t border-[var(--border-light)] pt-3">
            {lead.observacoes}
          </p>
        )}
      </Card>

      {/* Edit form */}
      <form onSubmit={handleSubmit}>
        <Card className="border-[var(--border)] bg-[var(--card)] p-5 space-y-4">
          <h2 className="font-semibold text-[var(--foreground)]">Editar dados</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Nome</Label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} className="bg-[var(--background)] border-[var(--border)]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Telefone</Label>
              <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} className="bg-[var(--background)] border-[var(--border)]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-[var(--text-secondary)]">E-mail</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="bg-[var(--background)] border-[var(--border)]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Origem</Label>
              <Select value={origem} onValueChange={(v) => setOrigem(v as LeadOrigin)}>
                <SelectTrigger className="bg-[var(--background)] border-[var(--border)]"><SelectValue /></SelectTrigger>
                <SelectContent>{LEAD_ORIGINS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Etapa</Label>
              <Select value={stage} onValueChange={(v) => setStage(v as FunnelStage)}>
                <SelectTrigger className="bg-[var(--background)] border-[var(--border)]"><SelectValue /></SelectTrigger>
                <SelectContent>{FUNNEL_STAGES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {stage === "Perdido" && (
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Motivo da perda</Label>
              <Input
                placeholder="Ex: preço, sem interesse..."
                value={motivoPerdido}
                onChange={(e) => setMotivoPerdido(e.target.value)}
                className="bg-[var(--background)] border-[var(--border)]"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Localização</Label>
              <Input value={localizacao} onChange={(e) => setLocalizacao(e.target.value)} className="bg-[var(--background)] border-[var(--border)]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Valor do negócio (R$)</Label>
              <Input value={dealValue} onChange={(e) => setDealValue(e.target.value)} type="number" min="0" step="0.01" className="bg-[var(--background)] border-[var(--border)]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-[var(--text-secondary)]">Observações</Label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
            />
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">Venda recorrente</p>
            </div>
            <Switch checked={vendaRecorrente} onCheckedChange={setVendaRecorrente} />
          </div>

          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white gap-2"
          >
            {updateMutation.isPending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save size={16} />
                Salvar alterações
              </>
            )}
          </Button>
        </Card>
      </form>
    </div>
  );
}
