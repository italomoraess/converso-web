'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { ThemeProvider, useTheme, themeStyle } from '@/lib/theme';

/** Applies the design tokens + current tweaks (dark mode, primary color,
 *  corners, typeface) to a root wrapper that fills the viewport. */
function ThemeShell({ children }: { children: ReactNode }) {
  const { tweaks } = useTheme();
  return (
    <div
      className={'cv-root' + (tweaks.dark ? ' cv-dark' : '')}
      style={{ ...themeStyle(tweaks), minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}
    >
      {children}
    </div>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ThemeShell>{children}</ThemeShell>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
