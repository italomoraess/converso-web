"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/axios";

interface CheckoutButtonProps {
  className?: string;
  children: React.ReactNode;
}

export function CheckoutButton({ className, children }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post<{ url: string }>("/billing/checkout-session");
      window.location.href = data.url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao processar. Tente novamente.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button onClick={handleCheckout} disabled={loading} className={className}>
        {loading ? <Loader2 size={18} className="animate-spin" /> : children}
      </button>
      {error && (
        <p className="text-center text-sm text-[var(--danger)]">{error}</p>
      )}
    </div>
  );
}
