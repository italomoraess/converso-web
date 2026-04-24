"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Mail, Lock, User, Zap, AlertCircle, ArrowRight } from "lucide-react";
import { publicClient } from "@/lib/axios-public";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthSession } from "@/types";

type NestBody<T> = { data: T };

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Preencha email e senha.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create account via our API
      const body: Record<string, string> = {
        email: email.trim().toLowerCase(),
        password,
      };
      if (name.trim()) body.name = name.trim();

      await publicClient.post<NestBody<AuthSession>>("/auth/register", body);

      // 2. Sign in with NextAuth using the new credentials
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Conta criada, mas houve um erro ao entrar. Tente fazer login.");
        router.replace("/login");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Brand */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-blue-500/25">
          <Zap size={28} color="#fff" />
        </div>
        <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight">
          Converso
        </h1>
        <p className="text-[var(--text-secondary)] text-sm">CRM para pequenos negócios</p>
      </div>

      {/* Card */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 shadow-sm space-y-5">
        <div>
          <h2 className="text-xl font-bold text-[var(--foreground)]">Criar conta</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Comece grátis, sem cartão de crédito.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm text-[var(--text-secondary)]">Nome (opcional)</Label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <Input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9 bg-[var(--background)] border-[var(--border)]"
                autoComplete="name"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-[var(--text-secondary)]">E-mail</Label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 bg-[var(--background)] border-[var(--border)]"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-[var(--text-secondary)]">Senha</Label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <Input
                type={showPass ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-10 bg-[var(--background)] border-[var(--border)]"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm text-red-600 dark:bg-red-950/50 dark:border-red-900 dark:text-red-400">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold h-11"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Criar conta
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-[var(--text-secondary)]">
        Já tem uma conta?{" "}
        <Link href="/login" className="text-[var(--primary)] font-semibold hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
