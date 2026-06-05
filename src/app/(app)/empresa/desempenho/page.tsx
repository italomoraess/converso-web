'use client';
import { CV, fmtBRL, catColor } from '@/lib/data';
import { WCard, Avatar } from '@/components/ui';
import { WDonut } from '@/components/charts';
import { useStore } from '@/components/app/store';
import { teamAgg } from '@/components/app/admin-utils';

export default function EmpresaDesempenhoPage() {
  const { equipe } = useStore();
  const a = teamAgg(equipe);
  const pct = Math.round((a.faturamento / CV.empresa.metaEquipe) * 100);
  const ranked = [...equipe].sort((x, y) => y.receita - x.receita);
  const maxRec = Math.max(...equipe.map((p) => p.receita), 1);

  // por área
  const areas: Record<string, number> = {};
  equipe.forEach((p) => { areas[p.area] = (areas[p.area] || 0) + p.receita; });
  const areaList = (Object.entries(areas) as [string, number][]).sort((x, y) => y[1] - x[1]);
  const maxArea = Math.max(...areaList.map((entry) => entry[1]), 1);
  const medal: [string, string, string] = ['#F59E0B', '#94A3B8', '#D97706'];

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <WCard pad={24}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <WDonut pct={pct} size={108} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>Meta da equipe · Junho</h3>
            <div className="cv-num" style={{ fontSize: 30, fontWeight: 800, fontFamily: 'var(--font-display)', marginTop: 6 }}>{fmtBRL(a.faturamento)} <span style={{ fontSize: 16, color: 'var(--text-subtle)', fontWeight: 600 }}>/ {fmtBRL(CV.empresa.metaEquipe)}</span></div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>Faltam <b style={{ color: 'var(--text)' }}>{fmtBRL(Math.max(0, CV.empresa.metaEquipe - a.faturamento))}</b> para bater a meta do mês.</div>
          </div>
          <div style={{ textAlign: 'center' }}><div className="cv-num" style={{ fontSize: 40, fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>{pct}%</div><div style={{ fontSize: 13, color: 'var(--text-subtle)', fontWeight: 600 }}>concluído</div></div>
        </div>
      </WCard>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 18 }}>
        <WCard pad={24}>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>Ranking de receita</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ranked.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 'var(--r-md)', background: i < 3 ? 'var(--bg)' : 'transparent', border: i < 3 ? 'none' : '1px solid var(--border)' }}>
                <div className="cv-num" style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, flexShrink: 0,
                  background: i < 3 ? `color-mix(in srgb, ${medal[i as 0 | 1 | 2]} 18%, transparent)` : 'var(--bg)', color: i < 3 ? medal[i as 0 | 1 | 2] : 'var(--text-subtle)' }}>{i + 1}</div>
                <Avatar ini={p.ini} cor={p.cor} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{p.nome}</div>
                  <div style={{ height: 6, borderRadius: 99, background: 'var(--bg)', overflow: 'hidden', marginTop: 6 }}><div style={{ width: (p.receita / maxRec) * 100 + '%', height: '100%', background: p.cor }} /></div>
                </div>
                <span className="cv-num" style={{ fontWeight: 800, fontSize: 14.5, whiteSpace: 'nowrap' }}>{fmtBRL(p.receita)}</span>
              </div>
            ))}
          </div>
        </WCard>

        <WCard pad={24}>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>Receita por área</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {areaList.map(([area, val]) => {
              const cc = catColor[area.split(' ')[0]] || catColor[area] || 'var(--primary)';
              return (
                <div key={area}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13.5 }}><span style={{ fontWeight: 600 }}>{area}</span><span className="cv-num" style={{ fontWeight: 800 }}>{fmtBRL(val)}</span></div>
                  <div style={{ height: 9, borderRadius: 99, background: 'var(--bg)', overflow: 'hidden' }}><div style={{ width: (val / maxArea) * 100 + '%', height: '100%', borderRadius: 99, background: cc }} /></div>
                </div>
              );
            })}
          </div>
        </WCard>
      </div>
    </div>
  );
}
