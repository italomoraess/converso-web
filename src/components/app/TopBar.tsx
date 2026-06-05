'use client';
/* CONVERSO Web — top bar (ported from web/ui.jsx WTopBar). */
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Icon } from '@/lib/icon';
import { CV } from '@/lib/data';
import { WButton } from '@/components/ui';
import { useStore } from './store';

const ROUTE_META: Record<string, { title: string; sub: string }> = {
  '/dashboard': { title: 'Dashboard', sub: 'Quarta, 4 de junho de 2026' },
  '/servicos': { title: 'Serviços', sub: 'Gerencie seu catálogo de serviços' },
  '/funil': { title: 'Funil de vendas', sub: 'Acompanhe suas oportunidades' },
  '/agenda': { title: 'Agenda', sub: 'Seus compromissos do mês' },
  '/clientes': { title: 'Clientes', sub: 'Sua base de contatos' },
  '/perfil': { title: 'Perfil & Configurações', sub: 'Sua conta no Converso' },
  '/empresa': { title: 'Visão geral', sub: CV.empresa.nome + ' · sua empresa' },
  '/empresa/autonomos': { title: 'Autônomos', sub: 'Gerencie os profissionais da equipe' },
  '/empresa/desempenho': { title: 'Desempenho', sub: 'Ranking e metas da equipe' },
  '/empresa/config': { title: 'Configurações da empresa', sub: CV.empresa.nome },
};

export function TopBar() {
  const pathname = usePathname();
  const { setSvcForm, flash } = useStore();
  const [q, setQ] = useState('');
  const meta = ROUTE_META[pathname] || { title: '', sub: '' };

  const onNew =
    pathname === '/servicos'
      ? () => setSvcForm({ editing: null })
      : pathname === '/clientes'
        ? () => flash('Novo cliente')
        : undefined;
  const newLabel = pathname === '/servicos' ? 'Novo serviço' : 'Novo cliente';

  return (
    <div
      style={{
        height: 70, flexShrink: 0, borderBottom: '1px solid var(--border)',
        background: 'color-mix(in srgb, var(--surface) 80%, transparent)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', gap: 18, padding: '0 28px', position: 'sticky', top: 0, zIndex: 20,
      }}
    >
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: 21, fontWeight: 800, letterSpacing: -0.3, lineHeight: 1.1 }}>{meta.title}</h1>
        {meta.sub && <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, marginTop: 1 }}>{meta.sub}</div>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '0 14px', height: 42, width: 260 }}>
        <Icon name="search" size={18} color="var(--text-subtle)" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..." style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text)' }} />
        <kbd style={{ fontSize: 11, color: 'var(--text-subtle)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 6px', fontWeight: 700 }}>⌘K</kbd>
      </div>
      <button style={{ width: 42, height: 42, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Icon name="bell" size={20} color="var(--text-muted)" />
        <span style={{ position: 'absolute', top: 9, right: 10, width: 7, height: 7, borderRadius: 99, background: 'var(--danger)', border: '2px solid var(--surface)' }} />
      </button>
      {onNew && (
        <WButton icon="plus" onClick={onNew}>
          {newLabel}
        </WButton>
      )}
    </div>
  );
}
