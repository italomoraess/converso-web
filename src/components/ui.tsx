'use client';
/* CONVERSO Web — UI primitives (ported from the design bundle). */
import { useState, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '@/lib/icon';

/* ---------- Logo ---------- */
export function LogoMark({ size = 30, light }: { size?: number; light?: boolean }) {
  const id = 'lg' + (light ? 'L' : '');
  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <svg viewBox="0 0 32 32" width={size} height={size}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={light ? '#fff' : 'var(--cv-500)'} />
            <stop offset="1" stopColor={light ? '#E0E3FF' : 'var(--cv-700)'} />
          </linearGradient>
        </defs>
        <path
          d="M16 3C9 3 3.5 7.6 3.5 13.4c0 3.2 1.7 6 4.4 7.9L7 27l6-3.2c1 .2 2 .3 3 .3 7 0 12.5-4.6 12.5-10.7S23 3 16 3z"
          fill={`url(#${id})`}
        />
        <path d="M11 11.5h10M11 15.5h6" stroke={light ? 'var(--primary)' : '#fff'} strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function Wordmark({ size = 26, light }: { size?: number; light?: boolean }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      <LogoMark size={size * 1.05} light={light} />
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size, letterSpacing: -0.6, color: light ? '#fff' : 'var(--text)' }}>
        Converso
      </span>
    </div>
  );
}

/* ---------- Avatar ---------- */
export function Avatar({ ini, cor, size = 40, ring }: { ini: string; cor?: string; size?: number; ring?: boolean }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        background: cor ? `color-mix(in srgb, ${cor} 16%, white)` : 'var(--primary-soft)',
        color: cor || 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: size * 0.36,
        fontFamily: 'var(--font-display)',
        letterSpacing: 0.3,
        boxShadow: ring ? `0 0 0 3px var(--surface), 0 0 0 5px ${cor || 'var(--primary)'}` : undefined,
      }}
    >
      {ini}
    </div>
  );
}

/* ---------- Badge ---------- */
export function Badge({
  children,
  color = 'var(--text-muted)',
  soft = true,
  dot,
  style = {},
}: {
  children: ReactNode;
  color?: string;
  soft?: boolean;
  dot?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: dot ? '5px 11px 5px 9px' : '5px 11px',
        borderRadius: 'var(--r-pill)',
        fontSize: 12.5,
        fontWeight: 700,
        lineHeight: 1,
        letterSpacing: 0.1,
        background: soft ? `color-mix(in srgb, ${color} 13%, transparent)` : color,
        color: soft ? color : '#fff',
        ...style,
      }}
    >
      {dot && <span style={{ width: 7, height: 7, borderRadius: 99, background: color }} />}
      {children}
    </span>
  );
}

/* ---------- Field ---------- */
export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon,
  right,
  hint,
  area,
}: {
  label?: string;
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: string;
  right?: ReactNode;
  hint?: string;
  area?: boolean;
}) {
  const [foc, setFoc] = useState(false);
  return (
    <label style={{ display: 'block' }}>
      {label && <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>{label}</div>}
      <div
        style={{
          display: 'flex',
          alignItems: area ? 'flex-start' : 'center',
          gap: 10,
          background: 'var(--surface)',
          border: `1.5px solid ${foc ? 'var(--primary)' : 'var(--border-strong)'}`,
          borderRadius: 'var(--r-md)',
          padding: area ? '13px 14px' : '0 14px',
          height: area ? undefined : 52,
          transition: 'border-color .15s',
          boxShadow: foc ? '0 0 0 4px var(--primary-soft)' : 'none',
        }}
      >
        {icon && <Icon name={icon} size={19} color="var(--text-subtle)" />}
        {area ? (
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            rows={3}
            onFocus={() => setFoc(true)}
            onBlur={() => setFoc(false)}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', resize: 'none', fontFamily: 'var(--font-ui)', fontSize: 15.5, color: 'var(--text)', lineHeight: 1.5 }}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            onFocus={() => setFoc(true)}
            onBlur={() => setFoc(false)}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 15.5, color: 'var(--text)', minWidth: 0 }}
          />
        )}
        {right}
      </div>
      {hint && <div style={{ fontSize: 12.5, color: 'var(--text-subtle)', marginTop: 7 }}>{hint}</div>}
    </label>
  );
}

/* ---------- Button ---------- */
type Variant = 'primary' | 'soft' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export function WButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  onClick,
  style = {},
  full,
  type = 'button',
}: {
  children?: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: string;
  onClick?: () => void;
  style?: CSSProperties;
  full?: boolean;
  type?: 'button' | 'submit';
}) {
  const sizes = { sm: { h: 36, px: 13, fs: 13.5 }, md: { h: 42, px: 17, fs: 14 }, lg: { h: 48, px: 20, fs: 15 } }[size];
  const variants: Record<Variant, CSSProperties> = {
    primary: { background: 'var(--primary)', color: 'var(--on-primary)', boxShadow: 'var(--sh-primary)' },
    soft: { background: 'var(--primary-soft)', color: 'var(--primary)' },
    outline: { background: 'var(--surface)', color: 'var(--text)', boxShadow: 'inset 0 0 0 1px var(--border-strong)' },
    ghost: { background: 'transparent', color: 'var(--text-muted)' },
    danger: { background: 'color-mix(in srgb, var(--danger) 11%, transparent)', color: 'var(--danger)' },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(.97)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = '')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
      style={{
        height: sizes.h,
        padding: `0 ${sizes.px}px`,
        fontSize: sizes.fs,
        width: full ? '100%' : undefined,
        fontFamily: 'var(--font-ui)',
        fontWeight: 700,
        border: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--r-md)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'transform .1s, filter .15s',
        whiteSpace: 'nowrap',
        ...variants[variant],
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} stroke={2.2} />}
      {children}
    </button>
  );
}

/* ---------- Card ---------- */
export function WCard({
  children,
  style = {},
  pad = 22,
  onClick,
}: {
  children: ReactNode;
  style?: CSSProperties;
  pad?: number;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--r-lg)',
        padding: pad,
        border: '1px solid var(--border)',
        boxShadow: 'var(--sh-sm)',
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- Modal ---------- */
export function WModal({
  children,
  onClose,
  width = 560,
  title,
}: {
  children: ReactNode;
  onClose: () => void;
  width?: number;
  title?: string;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(10,12,24,.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        animation: 'cv-fade .18s both',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: width,
          maxHeight: '88%',
          overflow: 'auto',
          background: 'var(--surface)',
          borderRadius: 'var(--r-xl)',
          boxShadow: 'var(--sh-lg)',
          animation: 'cv-pop .22s both',
        }}
      >
        {title && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              position: 'sticky',
              top: 0,
              background: 'var(--surface)',
              zIndex: 2,
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h3>
            <button
              onClick={onClose}
              style={{ border: 'none', background: 'var(--bg)', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Icon name="x" size={18} color="var(--text-muted)" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
