"use client";

import { signOut, useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, Crown, Clock, Mail, User, Shield } from "lucide-react";
import { getInitials, formatDate } from "@/lib/utils";

export default function PerfilPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const initials = getInitials(user?.name ?? undefined, user?.email ?? undefined);

  const isPro =
    user?.plan === "pro" || user?.stripeSubscriptionStatus === "active";
  const trialEnd = user?.trialEndsAt
    ? formatDate(user.trialEndsAt.slice(0, 10))
    : null;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Perfil</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
          Configurações da conta
        </p>
      </div>

      <Card className="border-[var(--border)] bg-[var(--card)] p-6">
        <div className="flex items-center gap-5">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="text-xl font-bold bg-[var(--primary)]/15 text-[var(--primary)]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                {user?.name || "Usuário"}
              </h2>
              {isPro ? (
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 gap-1">
                  <Crown size={10} />
                  Pro
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[var(--text-secondary)] gap-1">
                  <Shield size={10} />
                  Gratuito
                </Badge>
              )}
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">{user?.email}</p>
          </div>
        </div>
      </Card>

      <Card className="border-[var(--border)] bg-[var(--card)] divide-y divide-[var(--border-light)]">
        <div className="flex items-center gap-3 p-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--muted)] flex items-center justify-center">
            <User size={16} className="text-[var(--text-secondary)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)]">Nome</p>
            <p className="text-sm font-medium text-[var(--foreground)]">
              {user?.name || "Não informado"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--muted)] flex items-center justify-center">
            <Mail size={16} className="text-[var(--text-secondary)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)]">E-mail</p>
            <p className="text-sm font-medium text-[var(--foreground)]">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--muted)] flex items-center justify-center">
            <Crown size={16} className="text-[var(--text-secondary)]" />
          </div>
          <div>
            <p className="text-xs text-[var(--text-secondary)]">Plano</p>
            <p className="text-sm font-medium text-[var(--foreground)] capitalize">
              {user?.plan || "Gratuito"}
            </p>
          </div>
        </div>
        {trialEnd && !isPro && (
          <div className="flex items-center gap-3 p-4">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
              <Clock size={16} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">Trial até</p>
              <p className="text-sm font-medium text-[var(--foreground)]">{trialEnd}</p>
            </div>
          </div>
        )}
      </Card>

      {user?.stripeSubscriptionStatus && (
        <Card className="border-[var(--border)] bg-[var(--card)] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">Assinatura</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 capitalize">
                {user.stripeSubscriptionStatus}
              </p>
            </div>
            {user.subscriptionCancelAtPeriodEnd && (
              <Badge variant="outline" className="text-amber-600 border-amber-300">
                Cancela em breve
              </Badge>
            )}
          </div>
        </Card>
      )}

      <Button
        onClick={() => signOut({ callbackUrl: "/login" })}
        variant="outline"
        className="w-full border-[var(--border)] text-[var(--text-secondary)] hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/50 dark:hover:text-red-400 dark:hover:border-red-900 gap-2"
      >
        <LogOut size={16} />
        Sair da conta
      </Button>
    </div>
  );
}
