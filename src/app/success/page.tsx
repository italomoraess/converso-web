import Link from "next/link";
import { CheckCircle, Zap, ArrowRight } from "lucide-react";

export default function SucessoPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="w-20 h-20 rounded-full bg-[var(--success)]/15 flex items-center justify-center mx-auto">
            <CheckCircle size={40} className="text-[var(--success)]" />
          </div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Pagamento confirmado!</h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Sua assinatura Pro está ativa. Agora é só criar sua conta e começar.
          </p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center shrink-0">
              <Zap size={18} color="#fff" />
            </div>
            <div>
              <p className="font-semibold text-[var(--foreground)]">Converso Pro ativo</p>
              <p className="text-sm text-[var(--text-secondary)]">Acesso completo a todos os recursos</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 w-full h-12 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold rounded-xl transition-colors"
          >
            Criar minha conta
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full h-12 border border-[var(--border)] text-[var(--foreground)] font-medium rounded-xl hover:bg-[var(--muted)] transition-colors text-sm"
          >
            Já tenho conta — Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
