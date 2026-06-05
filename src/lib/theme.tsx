'use client';
/* CONVERSO Web — theme / "Tweaks": primary color, dark mode, corners, typeface.
   Ported from the design's tweaks model; persisted to localStorage. */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

export type Corners = 'round' | 'soft' | 'sharp';
export type Typeface = 'moderno' | 'geometrico' | 'suave';

export interface Tweaks {
  primaryColor: string;
  dark: boolean;
  corners: Corners;
  typeface: Typeface;
}

const DEFAULTS: Tweaks = {
  primaryColor: '#4F46E5',
  dark: true, // dark is the product default
  corners: 'round',
  typeface: 'moderno',
};

export const PRIMARY_SWATCHES = ['#4F46E5', '#0EA5E9', '#10B981', '#F97316', '#8B5CF6', '#E11D48'];

const TYPEFACES: Record<Typeface, { d: string; u: string }> = {
  moderno: { d: "'Sora', sans-serif", u: "'Plus Jakarta Sans', sans-serif" },
  geometrico: { d: "'Space Grotesk', sans-serif", u: "'Space Grotesk', sans-serif" },
  suave: { d: "'Manrope', sans-serif", u: "'Manrope', sans-serif" },
};

const CORNERS: Record<Corners, Record<string, string>> = {
  round: { '--r-sm': '8px', '--r-md': '14px', '--r-lg': '20px', '--r-xl': '28px' },
  soft: { '--r-sm': '6px', '--r-md': '10px', '--r-lg': '14px', '--r-xl': '18px' },
  sharp: { '--r-sm': '3px', '--r-md': '5px', '--r-lg': '7px', '--r-xl': '9px' },
};

const STORAGE_KEY = 'converso.tweaks';

interface ThemeCtx {
  tweaks: Tweaks;
  set: <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tweaks, setTweaks] = useState<Tweaks>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTweaks({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  const set = <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => {
    setTweaks((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const value = useMemo(() => ({ tweaks, set }), [tweaks]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

/** Build the CSS-variable overrides for the current tweaks. Spread onto the
 *  `.cv-root` element together with the `cv-dark` class when `dark` is true. */
export function themeStyle(t: Tweaks): CSSProperties {
  const c = t.primaryColor;
  return {
    '--primary': c,
    '--primary-press': `color-mix(in srgb, ${c} 80%, #000)`,
    '--on-primary': '#fff',
    ...(t.dark ? {} : { '--primary-soft': `color-mix(in srgb, ${c} 11%, #fff)` }),
    ...CORNERS[t.corners],
    '--font-display': TYPEFACES[t.typeface].d,
    '--font-ui': TYPEFACES[t.typeface].u,
  } as CSSProperties;
}
