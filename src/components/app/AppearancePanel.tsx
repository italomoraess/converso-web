'use client';
/* CONVERSO Web — live Appearance panel (the "Tweaks"): primary color, dark mode,
   corners, typeface. Adaptation of the design's TweaksPanel into a real drawer. */
import { Icon } from '@/lib/icon';
import { useTheme, PRIMARY_SWATCHES, type Corners, type Typeface } from '@/lib/theme';
import { useStore } from './store';

const CORNER_OPTS: { id: Corners; label: string }[] = [
  { id: 'round', label: 'Arredondado' },
  { id: 'soft', label: 'Suave' },
  { id: 'sharp', label: 'Reto' },
];
const TYPE_OPTS: { id: Typeface; label: string }[] = [
  { id: 'moderno', label: 'Moderno' },
  { id: 'geometrico', label: 'Geométrico' },
  { id: 'suave', label: 'Suave' },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: 0.7, margin: '20px 0 12px' }}>
      {children}
    </div>
  );
}

export function AppearancePanel() {
  const { tweaks, set } = useTheme();
  const { appearanceOpen, setAppearanceOpen } = useStore();
  if (!appearanceOpen) return null;

  return (
    <div onClick={() => setAppearanceOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 130, background: 'rgba(10,12,24,.45)', backdropFilter: 'blur(3px)', display: 'flex', justifyContent: 'flex-end', animation: 'cv-fade .18s both' }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: 340, height: '100%', background: 'var(--surface)', borderLeft: '1px solid var(--border)', boxShadow: 'var(--sh-lg)', padding: '22px 24px', overflowY: 'auto', animation: 'cv-fade-up .22s both' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Icon name="settings" size={20} color="var(--primary)" />
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Aparência</h3>
          </div>
          <button onClick={() => setAppearanceOpen(false)} style={{ border: 'none', background: 'var(--bg)', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon name="x" size={18} color="var(--text-muted)" />
          </button>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>Personalize a marca e o tema. Suas escolhas ficam salvas neste navegador.</p>

        <SectionLabel>Cor primária</SectionLabel>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {PRIMARY_SWATCHES.map((c) => {
            const on = tweaks.primaryColor.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                onClick={() => set('primaryColor', c)}
                aria-label={c}
                style={{ width: 38, height: 38, borderRadius: 12, cursor: 'pointer', border: 'none', background: c, boxShadow: on ? `0 0 0 3px var(--surface), 0 0 0 5px ${c}` : 'var(--sh-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {on && <Icon name="check" size={18} color="#fff" stroke={3} />}
              </button>
            );
          })}
        </div>

        <SectionLabel>Aparência</SectionLabel>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Modo escuro</span>
          <button
            onClick={() => set('dark', !tweaks.dark)}
            style={{ width: 46, height: 27, borderRadius: 99, border: 'none', cursor: 'pointer', position: 'relative', background: tweaks.dark ? 'var(--primary)' : 'var(--border-strong)', transition: 'background .2s' }}
          >
            <span style={{ position: 'absolute', top: 3, left: tweaks.dark ? 22 : 3, width: 21, height: 21, borderRadius: 99, background: '#fff', transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
          </button>
        </div>

        <SectionLabel>Cantos</SectionLabel>
        <div style={{ display: 'flex', gap: 8 }}>
          {CORNER_OPTS.map((o) => {
            const on = tweaks.corners === o.id;
            return (
              <button key={o.id} onClick={() => set('corners', o.id)} style={pill(on)}>
                {o.label}
              </button>
            );
          })}
        </div>

        <SectionLabel>Tipografia</SectionLabel>
        <div style={{ display: 'flex', gap: 8 }}>
          {TYPE_OPTS.map((o) => {
            const on = tweaks.typeface === o.id;
            return (
              <button key={o.id} onClick={() => set('typeface', o.id)} style={pill(on)}>
                {o.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function pill(on: boolean): React.CSSProperties {
  return {
    flex: 1,
    padding: '10px 0',
    borderRadius: 'var(--r-md)',
    cursor: 'pointer',
    border: 'none',
    fontFamily: 'var(--font-ui)',
    fontWeight: 700,
    fontSize: 13,
    background: on ? 'var(--primary-soft)' : 'var(--bg)',
    color: on ? 'var(--primary)' : 'var(--text-muted)',
    boxShadow: on ? 'inset 0 0 0 1.5px var(--primary)' : 'none',
  };
}
