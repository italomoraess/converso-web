'use client';

import React from 'react';
import { Icon } from '@/lib/icon';
import { fmtBRL, type Cliente, type Negocio } from '@/lib/data';
import { WCard, Avatar } from '@/components/ui';
import { useStore } from '@/components/app/store';

export default function ClientesPage() {
  const { clientes, negocios } = useStore();
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
    </div>
  );
}
