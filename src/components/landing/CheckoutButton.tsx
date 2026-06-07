'use client';
/* CONVERSO — CTA de assinatura da landing.
   Logado → cria a sessão Stripe Checkout e redireciona; anônimo → vai pro cadastro
   (trial grátis), de onde a assinatura pode ser concluída. */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { tokenStorage } from '@/lib/auth-storage';
import { billingService } from '@/services';

export function CheckoutButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const onClick = async () => {
    if (!tokenStorage.access) {
      // Sem conta/sessão → começa pelo cadastro (3 dias grátis).
      router.push('/cadastro');
      return;
    }
    setBusy(true);
    try {
      const { url } = await billingService.checkout();
      window.location.href = url; // página hospedada do Stripe
    } catch {
      router.push('/cadastro');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button type="button" className={className} onClick={onClick} disabled={busy}>
      {busy ? 'Redirecionando…' : children}
    </button>
  );
}
