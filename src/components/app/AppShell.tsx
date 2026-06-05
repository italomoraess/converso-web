'use client';
/* CONVERSO Web — authenticated shell: sidebar + topbar + content + toast + tweaks. */
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { AppStoreProvider, useStore } from './store';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { AppearancePanel } from './AppearancePanel';

function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div
      style={{
        position: 'fixed', bottom: 26, left: '50%', transform: 'translateX(-50%)', zIndex: 120,
        background: 'var(--text)', color: 'var(--bg)', padding: '13px 20px', borderRadius: 99,
        fontWeight: 700, fontSize: 14, boxShadow: 'var(--sh-lg)', animation: 'cv-fade-up .3s both', whiteSpace: 'nowrap',
      }}
    >
      {toast}
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <TopBar />
        <div key={pathname} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', background: 'var(--bg)', animation: 'cv-fade .25s both' }}>
          {children}
        </div>
      </div>
      <Toast />
      <AppearancePanel />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AppStoreProvider>
      <Shell>{children}</Shell>
    </AppStoreProvider>
  );
}
