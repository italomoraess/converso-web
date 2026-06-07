'use client';

import React, { useState } from 'react';
import { Icon } from '@/lib/icon';
import { fmtBRL, type Cliente, type Negocio } from '@/lib/data';
import { WButton, WCard, Avatar, Field, WModal } from '@/components/ui';
import { useStore } from '@/components/app/store';
import { TableSkeleton } from '@/components/app/Skeletons';

/* ── Modal de novo cliente ──────────────────────────────────────────────── */
function WNovoCliente({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (d: { nome: string; fone: string; email?: string }) => void | Promise<void>;
}) {
  const [f, setF] = useState({ nome: '', fone: '', email: '' });
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  const submit = async () => {
    if (!f.nome.trim() || saving) return;
    setSaving(true);
    try {
      await onSave({ nome: f.nome, fone: f.fone, email: f.email });
    } finally {
      setSaving(false);
    }
  };
  return (
    <WModal onClose={onClose} title="Novo cliente" width={480}>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Field label="Nome" icon="user" value={f.nome} onChange={set('nome')} placeholder="Nome do cliente" />
        <Field label="Telefone" icon="phone" value={f.fone} onChange={set('fone')} placeholder="(11) 98765-4321" />
        <Field label="E-mail" icon="mail" value={f.email} onChange={set('email')} placeholder="cliente@email.com" type="email" />
      </div>
      <div style={{ display: 'flex', gap: 12, padding: '16px 24px', borderTop: '1px solid var(--border)', justifyContent: 'flex-end' }}>
        <WButton variant="outline" onClick={onClose}>Cancelar</WButton>
        <WButton icon="check" onClick={submit} disabled={!f.nome.trim() || saving}>
          {saving ? 'Salvando…' : 'Cadastrar cliente'}
        </WButton>
      </div>
    </WModal>
  );
}

export default function ClientesPage() {
  const { clientes, negocios, loading, clienteFormOpen, setClienteFormOpen, addCliente } = useStore();
  if (loading) return <TableSkeleton toolbar={false} />;
  const dealsOf = (id: string): Negocio[] => negocios.filter((d: Negocio) => d.cliente === id);
  return (
    <div style={{ padding: 28 }}>
      <WCard pad={0} style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-ui)' }}>
          <thead><tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
            {['Cliente', 'Contato', 'Negócios', 'Valor total', ''].map((h, i) => (
              <th key={i} style={{ textAlign: 'left', padding: '13px 20px', fontSize: 12, fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: .5 }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {clientes.map((c: Cliente) => {
              const ds = dealsOf(c.id), val = ds.reduce((s: number, d: Negocio) => s + d.valor, 0);
              return (
                <tr key={c.id} className="w-row" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Avatar ini={c.ini} cor={c.cor} size={38} />
                      <span style={{ fontWeight: 700, fontSize: 14.5 }}>{c.nome}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div className="cv-num" style={{ fontSize: 13.5, color: 'var(--text-muted)', fontWeight: 600 }}>{c.fone}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-subtle)' }}>{c.email}</div>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className="cv-num" style={{ fontWeight: 700, fontSize: 14 }}>{ds.length}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span className="cv-num" style={{ fontWeight: 800, fontSize: 14.5 }}>{fmtBRL(val)}</span>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button style={{ border: 'none', background: 'var(--bg)', borderRadius: 9, width: 34, height: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                      <Icon name="whatsapp" size={17} color="#1FA855" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </WCard>

      {clienteFormOpen && (
        <WNovoCliente onClose={() => setClienteFormOpen(false)} onSave={addCliente} />
      )}
    </div>
  );
}
