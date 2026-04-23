"use client";

import { signOut } from "next-auth/react";
import { Zap, Check, Crown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const features = [
  "Leads ilimitados",
  "Funil de vendas Kanban",
  "Agenda e tarefas",
  "Catálogo de produtos",
  "Controle financeiro",
  "Relatórios e analytics",
  "WhatsApp direto do CRM",
];

export default function AssinaturaPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[var(--primary)] flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
            <Zap size={28} color="#fff" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Converso</h1>
          <p className="text-[var(--text-secondary)]">
            Para continuar usando o Converso, assine o plano Pro.
          </p>
        </div>

        <Card className="border-[var(--primary)]/40 bg-[var(--card)] p-8 space-y-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
              <Crown size={20} className="text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">Plano Pro</h2>
              <p className="text-sm text-[var(--text-secondary)]">Tudo que você precisa</p>
            </div>
          </div>

          <div className="space-y-3">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[var(--success)] flex items-center justify-center shrink-0">
                  <Check size={12} color="#fff" />
                </div>
                <span className="text-sm text-[var(--foreground)]">{f}</span>
              </div>
            ))}
          </div>

          <Button className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold h-12 gap-2">
            <Crown size={16} />
            Assinar agora
          </Button>
        </Card>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut size={14} />
          Sair da conta
        </button>
      </div>
    </div>
  );
}
