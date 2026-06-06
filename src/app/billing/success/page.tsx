'use client';
/* CONVERSO — retorno do Stripe Checkout (sucesso). O usuário volta já logado
   (token persiste no localStorage) e é levado para o painel. */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/lib/icon';
import { WButton } from '@/components/ui';
import { roleStorage } from '@/lib/auth-storage';
import { authService } from '@/services';

export default function BillingSuccessPage() {
  const router = useRouter();
  const [home] = useState(() => (roleStorage.get() === 'admin' ? '/empresa' : '/dashboard'));

  useEffect(() => {
    // Atualiza o perfil (status da assinatura) e segue para o painel.
    authService.me().catch(() => {});
    const t = setTimeout(() => router.replace(home), 2600);
    return () => clearTimeout(t);
  }, [router, home]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 28, background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 440, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-lg)', padding: 40, textAlign: 'center' }}>
        <div style={{ width: 68, height: 68, borderRadius: 99, margin: '0 auto 20px', background: 'color-mix(in srgb, var(--money) 16%, transparent)', color: 'var(--money)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={34} stroke={3} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.4 }}>Pagamento confirmado! 🎉</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 10, lineHeight: 1.6 }}>
          Sua assinatura do <b>Converso Pro</b> está ativa. Estamos te levando para o painel…
        </p>
        <div style={{ marginTop: 24 }}>
          <WButton size="lg" full icon="arrowR" onClick={() => router.replace(home)}>
            Ir para o painel agora
          </WButton>
        </div>
      </div>
    </div>
  );
}
