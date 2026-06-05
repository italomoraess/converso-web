'use client';
/* CONVERSO Web — splash overlay (ported from web/auth.jsx WSplash). */
import { useEffect } from 'react';
import { LogoMark } from '@/components/ui';

export function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1700);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'linear-gradient(155deg, var(--cv-600), var(--cv-800) 70%, var(--cv-900))', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ animation: 'cv-pop .7s cubic-bezier(.2,.9,.3,1.3) both', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <div style={{ width: 104, height: 104, borderRadius: 30, background: 'rgba(255,255,255,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.25)' }}>
          <LogoMark size={60} light />
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 44, color: '#fff', letterSpacing: -1.2 }}>Converso</div>
      </div>
      <div style={{ position: 'absolute', bottom: 80, display: 'flex', gap: 7 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 9, height: 9, borderRadius: 99, background: '#fff', animation: `cv-pulse 1s ${i * 0.18}s infinite` }} />
        ))}
      </div>
    </div>
  );
}
