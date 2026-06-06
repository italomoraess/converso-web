'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/lib/icon';
import { CV, fmtBRL, catColor, type Negocio, type Evento, type Etapa } from '@/lib/data';
import { WButton, WCard, Avatar, Badge } from '@/components/ui';
import { WSparkline, WBarChart } from '@/components/charts';
import { useStore } from '@/components/app/store';

export default function DashboardPage() {
  const router = useRouter();
  const { kpis: k, agenda, negocios, sparkReceita, receitaMeses, clienteById } = useStore();
  const pct = k.receitaMeta ? Math.round((k.receitaMes / k.receitaMeta) * 100) : 0;
  const today = new Date().getDate();
  const hoje = agenda.filter((a: Evento) => a.dia === today).sort((a: Evento, b: Evento) => a.hora.localeCompare(b.hora));
  const funilCounts = CV.etapas.map((e: Etapa) => ({
    ...e,
    n: negocios.filter((d: Negocio) => d.etapa === e.id).length,
    v: negocios.filter((d: Negocio) => d.etapa === e.id).reduce((s: number, d: Negocio) => s + d.valor, 0),
  }));
  const totalAberto = negocios.filter((d: Negocio) => d.etapa !== 'ganho').reduce((s: number, d: Negocio) => s + d.valor, 0);
  const maxFunil = Math.max(...funilCounts.map((c) => c.v), 1);

  const kpiCards = [
    { label: 'Receita do mês', value: fmtBRL(k.receitaMes), delta: `${k.receitaDelta >= 0 ? '+' : ''}${k.receitaDelta}%`, up: true, icon: 'dollar', color: 'var(--primary)', spark: sparkReceita },
    { label: 'A receber', value: fmtBRL(k.aReceber), sub: `${k.negociosAbertos} em aberto`, icon: 'receipt', color: 'var(--money)' },
    { label: 'Taxa de conversão', value: k.taxaConversao + '%', icon: 'target', color: 'var(--stage-nego)' },
    { label: 'Compromissos hoje', value: k.agendaHoje, sub: hoje[0] ? `Próximo às ${hoje[0].hora}` : 'Sem compromissos', icon: 'calendar', color: 'var(--stage-contato)' },
  ] as const;

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
        {kpiCards.map((c, i) => (
          <WCard key={c.label} pad={20} style={{ animation: `cv-fade-up .35s ${i * 0.05}s both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `color-mix(in srgb, ${c.color} 14%, transparent)`, color: c.color }}><Icon name={c.icon} size={21} stroke={2.2} /></div>
              {'delta' in c && c.delta && <Badge color="var(--money)" dot>{c.delta}</Badge>}
            </div>
            <div className="cv-num" style={{ fontSize: 28, fontWeight: 800, letterSpacing: -.6, marginTop: 16, fontFamily: 'var(--font-display)' }}>{c.value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>{c.label}</div>
            {'sub' in c && c.sub && <div style={{ fontSize: 12, color: 'var(--text-subtle)', marginTop: 6 }}>{c.sub}</div>}
            {'spark' in c && c.spark && <div style={{ marginTop: 6 }}><WSparkline data={c.spark} w={180} h={34} color={c.color} /></div>}
          </WCard>
        ))}
      </div>

      {/* main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 18 }}>
        <WCard pad={24}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Receita</h3>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>Últimos 6 meses</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="cv-num" style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)' }}>{fmtBRL(k.receitaMes)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end', color: 'var(--money)', fontSize: 13, fontWeight: 700, marginTop: 2 }}>
                <Icon name="trendUp" size={15} /> {pct}% da meta
              </div>
            </div>
          </div>
          <WBarChart data={receitaMeses} h={190} />
        </WCard>

        <WCard pad={24} style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Funil de vendas</h3>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 18 }}>{fmtBRL(totalAberto)} em aberto</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13, flex: 1 }}>
            {funilCounts.map((c) => (
              <div key={c.id} onClick={() => router.push('/funil')} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 99, background: c.cor }} />
                    <span style={{ fontSize: 13.5, fontWeight: 600 }}>{c.nome}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-subtle)', fontWeight: 700 }}>· {c.n}</span>
                  </div>
                  <span className="cv-num" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>{fmtBRL(c.v)}</span>
                </div>
                <div style={{ height: 7, borderRadius: 99, background: 'var(--bg)', overflow: 'hidden' }}>
                  <div style={{ width: (c.v / maxFunil) * 100 + '%', height: '100%', borderRadius: 99, background: c.cor }} />
                </div>
              </div>
            ))}
          </div>
        </WCard>
      </div>

      {/* bottom grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <WCard pad={24}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700 }}>Agenda de hoje</h3>
            <button onClick={() => router.push('/agenda')} style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>Ver agenda →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {hoje.map((a: Evento) => {
              const cl = clienteById(a.cliente), cc = catColor[a.tipo] || 'var(--primary)';
              return (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 'var(--r-md)', background: 'var(--bg)' }}>
                  <div className="cv-num" style={{ textAlign: 'center', minWidth: 46 }}>
                    <div style={{ fontSize: 15, fontWeight: 800 }}>{a.hora}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-subtle)', fontWeight: 600 }}>{a.dur}min</div>
                  </div>
                  <div style={{ width: 3, alignSelf: 'stretch', borderRadius: 99, background: cc }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{a.titulo}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 1 }}>{cl.nome}</div>
                  </div>
                  <Badge color={a.status === 'confirmado' ? 'var(--money)' : 'var(--warn)'} dot>{a.status === 'confirmado' ? 'Confirmado' : 'Pendente'}</Badge>
                </div>
              );
            })}
          </div>
        </WCard>

        <WCard pad={24}>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>Negócios em destaque</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {negocios.filter((d: Negocio) => d.etapa === 'nego' || d.etapa === 'prop').slice(0, 4).map((d: Negocio) => {
              const cl = clienteById(d.cliente), et = CV.etapas.find((e: Etapa) => e.id === d.etapa)!;
              return (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
                  <Avatar ini={cl.ini} cor={cl.cor} size={36} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.titulo}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{cl.nome}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="cv-num" style={{ fontWeight: 800, fontSize: 14.5 }}>{fmtBRL(d.valor)}</div>
                    <Badge color={et.cor} style={{ marginTop: 3 }}>{et.nome}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </WCard>
      </div>
    </div>
  );
}
