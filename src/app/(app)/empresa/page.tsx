'use client';
import { useRouter } from 'next/navigation';
import { Icon } from '@/lib/icon';
import { CV, fmtBRL } from '@/lib/data';
import { WCard, Avatar, Badge } from '@/components/ui';
import { WBarChart } from '@/components/charts';
import { useStore } from '@/components/app/store';
import { teamAgg } from '@/components/app/admin-utils';

export default function EmpresaVisaoPage() {
  const { equipe } = useStore();
  const router = useRouter();
  const a = teamAgg(equipe);
  const pct = Math.round((a.faturamento / CV.empresa.metaEquipe) * 100);
  const ranked = [...equipe].sort((x, y) => y.receita - x.receita);
  const maxRec = Math.max(...equipe.map((p) => p.receita), 1);

  const kpis = [
    { label: 'Faturamento da equipe', value: fmtBRL(a.faturamento), delta: '+14%', icon: 'dollar', color: 'var(--primary)' },
    { label: 'Autônomos ativos', value: `${a.ativos.length}/${equipe.length}`, sub: '1 pendente · 1 inativo', icon: 'users', color: 'var(--stage-contato)' },
    { label: 'Negócios em aberto', value: a.negocios, sub: 'na equipe toda', icon: 'funnel', color: 'var(--stage-nego)' },
    { label: 'Ticket médio', value: fmtBRL(a.ticket), sub: 'por cliente', icon: 'target', color: 'var(--money)' },
  ] as const;

  const atividade = [
    { ini: 'MV', cor: '#0EA5E9', txt: 'Marcos fechou um negócio de R$ 2.850', t: 'há 20 min' },
    { ini: 'AB', cor: '#10B981', txt: 'Ana cadastrou 2 novos clientes', t: 'há 1 h' },
    { ini: 'FL', cor: '#EC4899', txt: 'Fernanda aguarda aprovação de cadastro', t: 'há 3 h' },
    { ini: 'JM', cor: '#4F46E5', txt: 'Júlia agendou consultoria para amanhã', t: 'há 5 h' },
  ];

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
        {kpis.map((c, i) => (
          <WCard key={c.label} pad={20} style={{ animation: `cv-fade-up .35s ${i * 0.05}s both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `color-mix(in srgb, ${c.color} 14%, transparent)`, color: c.color }}><Icon name={c.icon} size={21} stroke={2.2} /></div>
              {'delta' in c && c.delta && <Badge color="var(--money)" dot>{c.delta}</Badge>}
            </div>
            <div className="cv-num" style={{ fontSize: 27, fontWeight: 800, letterSpacing: -.6, marginTop: 16, fontFamily: 'var(--font-display)' }}>{c.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>{c.label}</div>
            {'sub' in c && c.sub && <div style={{ fontSize: 12, color: 'var(--text-subtle)', marginTop: 6 }}>{c.sub}</div>}
          </WCard>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 18 }}>
        <WCard pad={24}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
            <div><h3 style={{ fontSize: 17, fontWeight: 700 }}>Faturamento da equipe</h3><div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Soma de todos os autônomos · 6 meses</div></div>
            <div style={{ textAlign: 'right' }}>
              <div className="cv-num" style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)' }}>{fmtBRL(a.faturamento)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end', color: 'var(--money)', fontSize: 13, fontWeight: 700, marginTop: 2 }}><Icon name="trendUp" size={15} /> {pct}% da meta</div>
            </div>
          </div>
          <WBarChart data={a.meses} h={190} />
        </WCard>

        <WCard pad={24} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700 }}>Por autônomo</h3>
            <button onClick={() => router.push('/empresa/autonomos')} style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>Ver todos →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {ranked.slice(0, 5).map((p) => (
              <div key={p.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
                  <Avatar ini={p.ini} cor={p.cor} size={26} />
                  <span style={{ fontSize: 13.5, fontWeight: 600, flex: 1 }}>{p.nome.split(' ')[0]} {p.nome.split(' ')[1]?.[0]}.</span>
                  <span className="cv-num" style={{ fontSize: 13, fontWeight: 800 }}>{fmtBRL(p.receita)}</span>
                </div>
                <div style={{ height: 7, borderRadius: 99, background: 'var(--bg)', overflow: 'hidden' }}>
                  <div style={{ width: (p.receita / maxRec) * 100 + '%', height: '100%', borderRadius: 99, background: p.cor }} />
                </div>
              </div>
            ))}
          </div>
        </WCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <WCard pad={24}>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>🏆 Destaques do mês</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ranked.slice(0, 3).map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 14px', borderRadius: 'var(--r-md)', background: 'var(--bg)' }}>
                <div className="cv-num" style={{ width: 26, height: 26, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13,
                  background: (['#FEF3C7', '#E5E7EB', '#FFE4D5'] as const)[i], color: (['#B45309', '#6B7280', '#C2410C'] as const)[i] }}>{i + 1}</div>
                <Avatar ini={p.ini} cor={p.cor} size={34} />
                <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{p.nome}</div><div style={{ fontSize: 12.5, color: 'var(--text-subtle)' }}>{p.area}</div></div>
                <div style={{ textAlign: 'right' }}><div className="cv-num" style={{ fontWeight: 800, fontSize: 14.5 }}>{fmtBRL(p.receita)}</div><div style={{ fontSize: 12, color: 'var(--money)', fontWeight: 700 }}>{p.conversao}% conv.</div></div>
              </div>
            ))}
          </div>
        </WCard>

        <WCard pad={24}>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>Atividade recente</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {atividade.map((ev, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i < atividade.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <Avatar ini={ev.ini} cor={ev.cor} size={32} />
                <div style={{ flex: 1, fontSize: 13.5, color: 'var(--text)', fontWeight: 500 }}>{ev.txt}</div>
                <div style={{ fontSize: 12, color: 'var(--text-subtle)', fontWeight: 600, whiteSpace: 'nowrap' }}>{ev.t}</div>
              </div>
            ))}
          </div>
        </WCard>
      </div>
    </div>
  );
}
