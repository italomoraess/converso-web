"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { leadsService } from "@/services/leads.service";
import { localLeadToApi } from "@/lib/mappers";
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
import {
  LEAD_ORIGINS,
  LEAD_ORIGIN_LABELS,
  FUNNEL_STAGES,
  FUNNEL_STAGE_LABELS,
  type FunnelStage,
  type LeadOrigin,
} from "@/types";
import { toast } from "sonner";

export default function NewLeadPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [origin, setOrigin] = useState<LeadOrigin>("Instagram");
  const [stage, setStage] = useState<FunnelStage>("New Lead");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [recurringDeal, setRecurringDeal] = useState(false);
  const [dealValue, setDealValue] = useState("");

  const mutation = useMutation({
    mutationFn: (body: Record<string, unknown>) => leadsService.create(body),
    onSuccess: (lead) => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead criado com sucesso!");
      router.push(`/leads/${lead.id}`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Nome e telefone são obrigatórios.");
      return;
    }
    const body = localLeadToApi({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      origin,
      stage,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
      recurringDeal,
      dealValue: dealValue ? parseFloat(dealValue) : undefined,
    });
    mutation.mutate(body);
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--muted)] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Novo Lead</h1>
          <p className="text-xs text-[var(--text-secondary)]">Preencha os dados do contato</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-[var(--border)] bg-[var(--card)] p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">
                Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Nome do cliente"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[var(--background)] border-[var(--border)]"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">
                Telefone <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-[var(--background)] border-[var(--border)]"
                type="tel"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-[var(--text-secondary)]">E-mail</Label>
            <Input
              placeholder="email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[var(--background)] border-[var(--border)]"
              type="email"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Origem</Label>
              <Select value={origin} onValueChange={(v) => setOrigin(v as LeadOrigin)}>
                <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_ORIGINS.map((o) => (
                    <SelectItem key={o} value={o}>{LEAD_ORIGIN_LABELS[o]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Etapa do Funil</Label>
              <Select value={stage} onValueChange={(v) => setStage(v as FunnelStage)}>
                <SelectTrigger className="bg-[var(--background)] border-[var(--border)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FUNNEL_STAGES.map((s) => (
                    <SelectItem key={s} value={s}>{FUNNEL_STAGE_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location + Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Localização</Label>
              <Input
                placeholder="Cidade, bairro..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-[var(--background)] border-[var(--border)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm text-[var(--text-secondary)]">Valor do negócio (R$)</Label>
              <Input
                placeholder="0,00"
                value={dealValue}
                onChange={(e) => setDealValue(e.target.value)}
                className="bg-[var(--background)] border-[var(--border)]"
                type="number"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-sm text-[var(--text-secondary)]">Observações</Label>
            <textarea
              placeholder="Anotações sobre o lead..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">Venda recorrente</p>
              <p className="text-xs text-[var(--text-secondary)]">Cliente retorna periodicamente</p>
            </div>
            <Switch
              checked={recurringDeal}
              onCheckedChange={setRecurringDeal}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1 border-[var(--border)]"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white gap-2"
            >
              {mutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={16} />
                  Salvar Lead
                </>
              )}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
