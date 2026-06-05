'use client';
/* CONVERSO Web — Funil de vendas (Kanban com drag-and-drop) */
import React, { useState } from 'react';
import { Icon } from '@/lib/icon';
import { CV, fmtBRL, clienteById, type Negocio, type StageId } from '@/lib/data';
import { WCard, Avatar } from '@/components/ui';
import { useStore } from '@/components/app/store';

export default function FunilPage() {
  const { negocios, moveDeal } = useStore();
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);

  const totalAberto = negocios
    .filter((d: Negocio) => d.etapa !== 'ganho')
    .reduce((s: number, d: Negocio) => s + d.valor, 0);
  const ganho = negocios
    .filter((d: Negocio) => d.etapa === 'ganho')
    .reduce((s: number, d: Negocio) => s + d.valor, 0);

  return (
    <div style={{ padding: 28, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <WCard pad={18} style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 210 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--money-soft)', color: 'var(--money)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="checkCircle" size={22} />
          </div>
          <div>
            <div className="cv-num" style={{ fontWeight: 800, fontSize: 19, fontFamily: 'var(--font-display)' }}>{fmtBRL(ganho)}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-subtle)', fontWeight: 600 }}>Fechado no mês</div>
          </div>
        </WCard>
        <WCard pad={18} style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 210 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="funnel" size={22} />
          </div>
          <div>
            <div className="cv-num" style={{ fontWeight: 800, fontSize: 19, fontFamily: 'var(--font-display)' }}>{fmtBRL(totalAberto)}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-subtle)', fontWeight: 600 }}>Em aberto · {negocios.filter((d: Negocio) => d.etapa !== 'ganho').length} negócios</div>
          </div>
        </WCard>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-subtle)', fontSize: 13, fontWeight: 600 }}>
          <Icon name="more" size={16} /> Arraste os cards entre as etapas
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', gap: 16, overflowX: 'auto', minHeight: 0 }}>
        {CV.etapas.map((e) => {
          const items = negocios.filter((d: Negocio) => d.etapa === e.id);
          const val = items.reduce((s: number, d: Negocio) => s + d.valor, 0);
          const isOver = overCol === e.id;
          return (
            <div
              key={e.id}
              style={{ flex: 1, minWidth: 248, display: 'flex', flexDirection: 'column' }}
              onDragOver={(ev: React.DragEvent) => { ev.preventDefault(); setOverCol(e.id); }}
              onDragLeave={() => setOverCol((c) => (c === e.id ? null : c))}
              onDrop={() => { if (dragId) moveDeal(dragId, e.id as StageId); setDragId(null); setOverCol(null); }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 99, background: e.cor }} />
                <span style={{ fontWeight: 700, fontSize: 15 }}>{e.nome}</span>
                <span className="cv-num" style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 800, color: 'var(--text-subtle)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '2px 9px', borderRadius: 99 }}>{items.length}</span>
              </div>
              <div className="cv-num" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12 }}>{fmtBRL(val)}</div>
              <div style={{
                flex: 1, display: 'flex', flexDirection: 'column', gap: 11, padding: 10,
                borderRadius: 'var(--r-lg)', overflowY: 'auto',
                background: isOver ? 'var(--primary-soft)' : 'var(--bg)',
                border: `2px dashed ${isOver ? 'var(--primary)' : 'transparent'}`,
                transition: 'background .12s, border-color .12s',
              }}>
                {items.map((d: Negocio) => {
                  const cl = clienteById(d.cliente);
                  return (
                    <div
                      key={d.id}
                      draggable
                      onDragStart={(ev: React.DragEvent) => { ev.dataTransfer.effectAllowed = 'move'; setDragId(d.id); }}
                      onDragEnd={() => { setDragId(null); setOverCol(null); }}
                      style={{
                        background: 'var(--surface)', borderRadius: 'var(--r-md)', padding: 15,
                        border: '1px solid var(--border)', borderLeft: `3px solid ${e.cor}`,
                        boxShadow: 'var(--sh-sm)', cursor: 'grab',
                        opacity: dragId === d.id ? 0.4 : 1, transition: 'opacity .12s',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{d.titulo}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-subtle)', fontWeight: 600, marginTop: 3 }}>{d.servico}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 13 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Avatar ini={cl.ini} cor={cl.cor} size={26} />
                          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-muted)' }}>{cl.nome.split(' ')[0]}</span>
                        </div>
                        <span className="cv-num" style={{ fontWeight: 800, fontSize: 14.5, whiteSpace: 'nowrap' }}>{fmtBRL(d.valor)}</span>
                      </div>
                    </div>
                  );
                })}
                {items.length === 0 && (
                  <div style={{ padding: '20px 10px', textAlign: 'center', color: 'var(--text-subtle)', fontSize: 12.5, fontWeight: 600 }}>
                    Solte um card aqui
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
