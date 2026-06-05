'use client';
/* CONVERSO Web — lightweight SVG charts (ported from the design bundle). */

export function WSparkline({
  data,
  w = 130,
  h = 44,
  color = 'var(--primary)',
}: {
  data: number[];
  w?: number;
  h?: number;
  color?: string;
}) {
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - (v / max) * (h - 6) - 3]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const gid = `wspk-${color.replace(/[^a-z0-9]/gi, '')}`;
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".25" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L${w} ${h} L0 ${h} Z`} fill={`url(#${gid})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WBarChart({ data, h = 150 }: { data: { m: string; v: number }[]; h?: number }) {
  const max = Math.max(...data.map((d) => d.v), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: h }}>
      {data.map((d, i) => {
        const last = i === data.length - 1;
        return (
          <div key={d.m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, height: '100%', justifyContent: 'flex-end' }}>
            <div className="cv-num" style={{ fontSize: 12, fontWeight: 700, color: last ? 'var(--primary)' : 'var(--text-subtle)' }}>
              {(d.v / 1000).toFixed(1)}k
            </div>
            <div
              style={{
                width: '100%',
                maxWidth: 46,
                height: (d.v / max) * (h - 46),
                borderRadius: 'var(--r-sm)',
                transformOrigin: 'bottom',
                background: last ? 'var(--primary)' : 'color-mix(in srgb, var(--primary) 22%, var(--surface))',
                animation: `cv-bar-grow .5s ${i * 0.06}s both`,
              }}
            />
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-subtle)' }}>{d.m}</div>
          </div>
        );
      })}
    </div>
  );
}

export function WDonut({ pct, size = 92, color = 'var(--primary)' }: { pct: number; size?: number; color?: string }) {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
}
