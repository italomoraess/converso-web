"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AuthTokenSync } from "@/components/auth-token-sync";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            retry: (failureCount, error) => {
              const msg = error instanceof Error ? error.message : "";
              if (msg.includes("Sessão expirada") || msg.includes("Plano ativo")) return false;
              return failureCount < 1;
            },
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <AuthTokenSync />
          {children}
          <Toaster position="top-right" richColors />
        </QueryClientProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
