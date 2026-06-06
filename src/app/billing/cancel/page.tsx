'use client';
/* CONVERSO — retorno do Stripe Checkout (cancelado/não concluído). */
import { useRouter } from 'next/navigation';
import { Icon } from '@/lib/icon';
import { WButton } from '@/components/ui';
import { roleStorage } from '@/lib/auth-storage';

export default function BillingCancelPage() {
  const router = useRouter();
  const home = roleStorage.get() === 'admin' ? '/empresa' : '/dashboard';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28, background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 440, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-lg)', padding: 40, textAlign: 'center' }}>
        <div style={{ width: 68, height: 68, borderRadius: 99, margin: '0 auto 20px', background: 'var(--bg)', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="x" size={32} stroke={2.6} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.4 }}>Pagamento não concluído</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 10, lineHeight: 1.6 }}>
          Tudo bem — você pode assinar quando quiser. Seu período de teste continua disponível.
        </p>
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <WButton size="lg" full icon="arrowR" onClick={() => router.push('/#planos')}>
            Ver planos novamente
          </WButton>
          <WButton size="lg" full variant="outline" onClick={() => router.replace(home)}>
            Ir para o painel
          </WButton>
        </div>
      </div>
    </div>
  );
}
