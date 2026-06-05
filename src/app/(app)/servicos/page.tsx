'use client';

import { useState } from 'react';
import { Icon } from '@/lib/icon';
import { CV, fmtBRL, clienteById, catColor, catIcon, STATUS_META, type Servico } from '@/lib/data';
import { WButton, WCard, Avatar, Badge, Field, WModal } from '@/components/ui';
import { useStore } from '@/components/app/store';

/* ── local form state type ──────────────────────────────────────────────── */
type SvcFormState = {
  nome: string;
  cat: string;
  preco: string | number;
  dur: string;
  status: 'ativo' | 'pausado' | 'rascunho';
  cliente: string;
  desc: string;
  id?: string;
};

/* ── WServicoForm ───────────────────────────────────────────────────────── */
interface WServicoFormProps {
  editing: Servico | null;
  onClose: () => void;
  onSave: (f: Servico) => void;
  onDelete: (id: string) => void;
}

function WServicoForm({ editing, onClose, onSave, onDelete }: WServicoFormProps) {
  const blank: SvcFormState = { nome: '', cat: 'Consultoria', preco: '', dur: '1h', status: 'ativo', cliente: 'c1', desc: '' };
  const [f, setF] = useState<SvcFormState>(editing ? { ...editing } : blank);
  const set = (k: keyof SvcFormState) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  const cats = Object.keys(CV.catColor);
  const durs = ['30min', '1h', '1h30', '2h', '3h', '4h', 'Dia'];

  return (
    <WModal onClose={onClose} title={editing ? 'Editar serviço' : 'Novo serviço'} width={580}>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Field label="Nome do serviço" value={f.nome} onChange={set('nome')} placeholder="Ex: Consultoria de Marca" />
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Categoria</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {cats.map((c) => {
              const on = f.cat === c;
              const cc = CV.catColor[c];
              return (
                <button
                  key={c}
                  onClick={() => set('cat')(c)}
                  style={{
                    padding: '9px 14px', borderRadius: 99, cursor: 'pointer',
                    fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13,
                    border: 'none', display: 'inline-flex', alignItems: 'center', gap: 7,
                    background: on ? `color-mix(in srgb, ${cc} 15%, transparent)` : 'var(--bg)',
                    color: on ? cc : 'var(--text-muted)',
                    boxShadow: on ? `inset 0 0 0 1.5px ${cc}` : 'none',
                  }}
                >
                  <Icon name={catIcon(c)} size={15} /> {c}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <Field label="Preço (R$)" value={String(f.preco)} onChange={set('preco')} placeholder="0,00" icon="dollar" type="number" />
          </div>
          <div style={{ flex: 1.3 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Duração</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {durs.map((d) => (
                <button
                  key={d}
                  onClick={() => set('dur')(d)}
                  style={{
                    padding: '9px 12px', borderRadius: 10, cursor: 'pointer',
                    fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13,
                    border: 'none',
                    background: f.dur === d ? 'var(--primary)' : 'var(--bg)',
                    color: f.dur === d ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Cliente vinculado</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {CV.clientes.map((c) => {
              const on = f.cliente === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => set('cliente')(c.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 12px 6px 6px', borderRadius: 99, cursor: 'pointer', border: 'none',
                    background: on ? 'var(--primary-soft)' : 'var(--bg)',
                    boxShadow: on ? 'inset 0 0 0 1.5px var(--primary)' : 'none',
                  }}
                >
                  <Avatar ini={c.ini} cor={c.cor} size={26} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: on ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {c.nome.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <Field label="Descrição" area value={f.desc} onChange={set('desc')} placeholder="O que está incluso neste serviço?" />
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Status</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(Object.entries(STATUS_META) as [string, { label: string; cor: string }][]).map(([key, m]) => (
              <button
                key={key}
                onClick={() => set('status')(key)}
                style={{
                  flex: 1, padding: '12px 0', borderRadius: 'var(--r-md)', cursor: 'pointer',
                  fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13.5, border: 'none',
                  background: f.status === key ? `color-mix(in srgb, ${m.cor} 13%, transparent)` : 'var(--bg)',
                  color: f.status === key ? m.cor : 'var(--text-muted)',
                  boxShadow: f.status === key ? `inset 0 0 0 1.5px ${m.cor}` : 'none',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 24px', borderTop: '1px solid var(--border)', position: 'sticky', bottom: 0, background: 'var(--surface)' }}>
        {editing && (
          <WButton variant="danger" icon="trash" onClick={() => onDelete(editing.id)}>Excluir</WButton>
        )}
        <div style={{ flex: 1 }} />
        <WButton variant="outline" onClick={onClose}>Cancelar</WButton>
        <WButton
          icon="check"
          onClick={() =>
            onSave({
              ...f,
              preco: typeof f.preco === 'string' ? parseFloat(f.preco) || 0 : f.preco,
              id: f.id ?? ('s' + Date.now()),
            } as Servico)
          }
        >
          {editing ? 'Salvar alterações' : 'Criar serviço'}
        </WButton>
      </div>
    </WModal>
  );
}

/* ── ServicosPage (WServicos logic) ─────────────────────────────────────── */
export default function ServicosPage() {
  const { servicos, svcForm, setSvcForm, saveService, deleteService } = useStore();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('Todos');
  const cats = ['Todos', ...Object.keys(CV.catColor)];
  const list = servicos.filter(
    (s: Servico) =>
      (cat === 'Todos' || s.cat === cat) &&
      s.nome.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div style={{ padding: 28 }}>
      {/* toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '0 14px', height: 42, width: 280 }}>
          <Icon name="search" size={18} color="var(--text-subtle)" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar serviço..."
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text)' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 7, flex: 1, flexWrap: 'wrap' }}>
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                padding: '8px 14px', borderRadius: 99, cursor: 'pointer',
                fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13,
                border: 'none',
                background: cat === c ? 'var(--primary)' : 'var(--surface)',
                color: cat === c ? '#fff' : 'var(--text-muted)',
                boxShadow: cat === c ? 'var(--sh-primary)' : 'inset 0 0 0 1px var(--border)',
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <WButton icon="plus" onClick={() => setSvcForm({ editing: null })}>Novo serviço</WButton>
      </div>

      {/* table */}
      <WCard pad={0} style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-ui)' }}>
          <thead>
            <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              {['Serviço', 'Cliente', 'Preço', 'Duração', 'Status', ''].map((h, i) => (
                <th
                  key={i}
                  style={{ textAlign: 'left', padding: '13px 20px', fontSize: 12, fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: 0.5 }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((s: Servico) => {
              const cl = CV.clienteById(s.cliente);
              const cc = CV.catColor[s.cat] || 'var(--primary)';
              const st = STATUS_META[s.status];
              return (
                <tr
                  key={s.id}
                  onClick={() => setSvcForm({ editing: s })}
                  className="w-row"
                  style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `color-mix(in srgb, ${cc} 14%, transparent)`, color: cc }}>
                        <Icon name={catIcon(s.cat)} size={20} stroke={2.1} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14.5 }}>{s.nome}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--text-subtle)' }}>{s.cat}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <Avatar ini={cl.ini} cor={cl.cor} size={28} />
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-muted)' }}>{cl.nome}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className="cv-num" style={{ fontWeight: 800, fontSize: 14.5 }}>{CV.fmtBRL(s.preco)}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 13.5, color: 'var(--text-muted)', fontWeight: 600 }}>{s.dur}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <Badge color={st.cor} dot>{st.label}</Badge>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSvcForm({ editing: s }); }}
                      style={{ border: 'none', background: 'var(--bg)', borderRadius: 9, width: 34, height: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      <Icon name="edit" size={17} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {list.length === 0 && (
          <div style={{ padding: 50, textAlign: 'center', color: 'var(--text-subtle)', fontWeight: 600 }}>
            Nenhum serviço encontrado.
          </div>
        )}
      </WCard>

      {svcForm && (
        <WServicoForm
          editing={svcForm.editing}
          onClose={() => setSvcForm(null)}
          onSave={saveService}
          onDelete={deleteService}
        />
      )}
    </div>
  );
}
