'use client';
/* CONVERSO Web — auth brand panel (ported from web/auth.jsx WBrandPanel). */
import type { ReactNode } from 'react';

export function BrandPanel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(155deg, var(--cv-600), var(--cv-800) 70%, var(--cv-900))',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '46px 48px',
      }}
    >
      <div style={{ position: 'absolute', top: -90, right: -70, width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,.14), transparent 70%)' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -90, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,.10), transparent 70%)' }} />
      {children}
    </div>
  );
}
