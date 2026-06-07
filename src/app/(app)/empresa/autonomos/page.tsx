'use client';
import { useState } from 'react';
import { Icon } from '@/lib/icon';
import { CV, fmtBRL, catColor, STATUS_TEAM, type Membro } from '@/lib/data';
import { WButton, WCard, Avatar, Badge, Field, WModal } from '@/components/ui';
import { WSparkline } from '@/components/charts';
import { useStore } from '@/components/app/store';
import { TableSkeleton } from '@/components/app/Skeletons';

/* ---------- WInviteForm ---------- */
function WInviteForm({ onClose, onSave }: { onClose: () => void; onSave: (m: { nome: string; email: string; area: string }) => void }) {
  const [f, setF] = useState({ nome: '', email: '', area: 'Consultoria' });
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  return (
    <WModal onClose={onClose} title="Convidar autônomo" width={480}>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: -4 }}>Envie um convite por e-mail. O autônomo entra com cadastro pendente até aprovação.</p>
        <Field label="Nome" icon="user" value={f.nome} onChange={set('nome')} placeholder="Nome do profissional" />
        <Field label="E-mail" icon="mail" value={f.email} onChange={set('email')} placeholder="profissional@email.com" />
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Área</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.keys(catColor).map((c) => {
              const on = f.area === c;
              const cc = catColor[c];
              return (
                <button key={c} onClick={() => set('area')(c)} style={{ padding: '9px 14px', borderRadius: 99, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13, border: 'none', background: on ? `color-mix(in srgb, ${cc} 15%, transparent)` : 'var(--bg)', color: on ? cc : 'var(--text-muted)', boxShadow: on ? `inset 0 0 0 1.5px ${cc}` : 'none' }}>{c}</button>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, padding: '16px 24px', borderTop: '1px solid var(--border)', justifyContent: 'flex-end' }}>
        <WButton variant="outline" onClick={onClose}>Cancelar</WButton>
        <WButton icon="mail" onClick={() => onSave(f)}>Enviar convite</WButton>
      </div>
    </WModal>
  );
}

/* ---------- WAutonomoDetail ---------- */
function WAutonomoDetail({ p, onClose, flash, onApprove }: { p: Membro; onClose: () => void; flash: (msg: string) => void; onApprove: (id: string) => void }) {
  const st = STATUS_TEAM[p.status];
  const stats: [string, string | number][] = [
    ['Receita/mês', fmtBRL(p.receita)],
    ['Clientes', p.clientes],
    ['Negócios', p.negocios],
    ['Conversão', p.conversao + '%'],
    ['Serviços', p.servicos],
    ['Na equipe desde', p.desde],
  ];
  return (
    <WModal onClose={onClose} width={560}>
      <div style={{ height: 90, background: `linear-gradient(135deg, ${p.cor}, color-mix(in srgb, ${p.cor} 55%, #160f3a))`, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, border: 'none', background: 'rgba(255,255,255,.2)', borderRadius: 9, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="x" size={17} color="#fff" /></button>
      </div>
      <div style={{ padding: '0 26px 26px', marginTop: -34 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: `color-mix(in srgb, ${p.cor} 16%, white)`, color: p.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 27, fontFamily: 'var(--font-display)', border: '4px solid var(--surface)' }}>{p.ini}</div>
          <div style={{ flex: 1, paddingBottom: 4 }}><h3 style={{ fontSize: 21, fontWeight: 800 }}>{p.nome}</h3><div style={{ fontSize: 13.5, color: 'var(--text-muted)', fontWeight: 600 }}>{p.area}</div></div>
          <Badge color={st.cor} dot style={{ marginBottom: 8 }}>{st.label}</Badge>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 22 }}>
          {stats.map(([l, v]) => (
            <div key={l} style={{ padding: '14px 16px', borderRadius: 'var(--r-md)', background: 'var(--bg)' }}>
              <div className="cv-num" style={{ fontWeight: 800, fontSize: 18, fontFamily: 'var(--font-display)' }}>{v}</div>
              <div style={{ fontSize: 12, color: 'var(--text-subtle)', fontWeight: 600, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10 }}>Receita · 6 meses</div>
          <WSparkline data={p.spark} w={500} h={56} color={p.cor} />
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
          {p.status === 'pendente'
            ? <WButton full icon="check" onClick={() => { onApprove(p.id); flash('Cadastro aprovado ✓'); onClose(); }}>Aprovar cadastro</WButton>
            : <WButton full variant="soft" icon="chart" onClick={() => { flash('Abrindo relatório...'); }}>Ver relatório completo</WButton>}
          <WButton variant="outline" icon="whatsapp" style={{ color: '#1FA855' }} onClick={() => flash('Abrindo conversa...')}>Mensagem</WButton>
        </div>
      </div>
    </WModal>
  );
}

/* ---------- Page ---------- */
export default function EmpresaAutonomosPage() {
  const { equipe, inviteMember, flash, setMemberStatus, loading } = useStore();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('Todos');
  const [invite, setInvite] = useState(false);
  const [detail, setDetail] = useState<Membro | null>(null);
  if (loading) return <TableSkeleton />;
  const filters = ['Todos', 'Ativo', 'Pendente', 'Inativo'];
  const list = equipe.filter(
    (p) => (status === 'Todos' || CV.STATUS_TEAM[p.status].label === status) && p.nome.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '0 14px', height: 42, width: 280 }}>
          <Icon name="search" size={18} color="var(--text-subtle)" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar autônomo..." style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text)' }} />
        </div>
        <div style={{ display: 'flex', gap: 7, flex: 1 }}>
          {filters.map((f) => (
            <button key={f} onClick={() => setStatus(f)} style={{ padding: '8px 14px', borderRadius: 99, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13, border: 'none',
              background: status === f ? 'var(--primary)' : 'var(--surface)', color: status === f ? '#fff' : 'var(--text-muted)', boxShadow: status === f ? 'var(--sh-primary)' : 'inset 0 0 0 1px var(--border)' }}>{f}</button>
          ))}
        </div>
        <WButton icon="plus" onClick={() => setInvite(true)}>Convidar autônomo</WButton>
      </div>

      <WCard pad={0} style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-ui)' }}>
          <thead><tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
            {['Autônomo', 'Status', 'Receita/mês', 'Clientes', 'Negócios', 'Conversão', ''].map((h, i) => (
              <th key={i} style={{ textAlign: 'left', padding: '13px 20px', fontSize: 12, fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: .5 }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {list.map((p) => {
              const st = CV.STATUS_TEAM[p.status];
              return (
                <tr key={p.id} onClick={() => setDetail(p)} className="w-row" style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                  <td style={{ padding: '14px 20px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Avatar ini={p.ini} cor={p.cor} size={40} /><div><div style={{ fontWeight: 700, fontSize: 14.5 }}>{p.nome}</div><div style={{ fontSize: 12.5, color: 'var(--text-subtle)' }}>{p.area}</div></div></div></td>
                  <td style={{ padding: '14px 20px' }}><Badge color={st.cor} dot>{st.label}</Badge></td>
                  <td style={{ padding: '14px 20px' }}><span className="cv-num" style={{ fontWeight: 800, fontSize: 14.5 }}>{fmtBRL(p.receita)}</span></td>
                  <td style={{ padding: '14px 20px' }}><span className="cv-num" style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-muted)' }}>{p.clientes}</span></td>
                  <td style={{ padding: '14px 20px' }}><span className="cv-num" style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-muted)' }}>{p.negocios}</span></td>
                  <td style={{ padding: '14px 20px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 46, height: 6, borderRadius: 99, background: 'var(--bg)', overflow: 'hidden' }}><div style={{ width: p.conversao + '%', height: '100%', background: p.cor }} /></div><span className="cv-num" style={{ fontSize: 13, fontWeight: 700 }}>{p.conversao}%</span></div></td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}><button onClick={(e) => { e.stopPropagation(); setDetail(p); }} style={{ border: 'none', background: 'var(--bg)', borderRadius: 9, width: 34, height: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}><Icon name="chevR" size={17} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {list.length === 0 && <div style={{ padding: 50, textAlign: 'center', color: 'var(--text-subtle)', fontWeight: 600 }}>Nenhum autônomo encontrado.</div>}
      </WCard>

      {invite && <WInviteForm onClose={() => setInvite(false)} onSave={(m) => { inviteMember(m); setInvite(false); }} />}
      {detail && <WAutonomoDetail p={detail} onClose={() => setDetail(null)} flash={flash} onApprove={(id) => setMemberStatus(id, 'ativo')} />}
    </div>
  );
}
