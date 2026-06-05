'use client';
/* CONVERSO Web — sidebar with role-aware navigation (ported from web/ui.jsx). */
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@/lib/icon';
import { CV } from '@/lib/data';
import { Avatar, LogoMark, Wordmark } from '@/components/ui';
import { useStore } from './store';

const navAutonomo = [
  { id: 'dashboard', icon: 'home', label: 'Dashboard', href: '/dashboard' },
  { id: 'servicos', icon: 'briefcase', label: 'Serviços', href: '/servicos' },
  { id: 'funil', icon: 'funnel', label: 'Funil de vendas', href: '/funil' },
  { id: 'agenda', icon: 'calendar', label: 'Agenda', href: '/agenda' },
  { id: 'clientes', icon: 'users', label: 'Clientes', href: '/clientes' },
];
const navAdmin = [
  { id: 'visao', icon: 'chart', label: 'Visão geral', href: '/empresa' },
  { id: 'autonomos', icon: 'users', label: 'Autônomos', href: '/empresa/autonomos' },
  { id: 'desempenho', icon: 'trendUp', label: 'Desempenho', href: '/empresa/desempenho' },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { role, setRole, collapsed, setCollapsed } = useStore();
  const isAdmin = role === 'admin';
  const nav = isAdmin ? navAdmin : navAutonomo;
  const profileHref = isAdmin ? '/empresa/config' : '/perfil';
  const footUser = isAdmin
    ? { ini: CV.empresa.adminIni, nome: CV.empresa.admin, sub: CV.empresa.nome }
    : { ini: CV.user.ini, nome: CV.user.nome, sub: 'Plano ' + CV.user.plano };
  const w = collapsed ? 76 : 248;

  const switchMode = () => {
    const nm = isAdmin ? 'autonomo' : 'admin';
    setRole(nm);
    router.push(nm === 'admin' ? '/empresa' : '/dashboard');
  };

  return (
    <div style={{ width: w, flexShrink: 0, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', transition: 'width .2s ease', height: '100%' }}>
      <div style={{ padding: collapsed ? '20px 0' : '22px 22px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
        {collapsed ? <LogoMark size={30} /> : <Wordmark size={23} />}
      </div>

      {!collapsed && isAdmin && (
        <div style={{ margin: '0 14px 8px', padding: '9px 12px', borderRadius: 'var(--r-md)', background: 'color-mix(in srgb, var(--stage-nego) 12%, transparent)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="lock" size={15} color="var(--stage-nego)" />
          <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--stage-nego)' }}>Painel do administrador</span>
        </div>
      )}

      <div style={{ flex: 1, padding: collapsed ? '6px 12px' : '6px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {!collapsed && (
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: 0.7, padding: '8px 12px 6px' }}>
            {isAdmin ? 'Empresa' : 'Menu'}
          </div>
        )}
        {nav.map((n) => {
          const on = pathname === n.href || (n.href !== '/empresa' && pathname.startsWith(n.href));
          return (
            <button
              key={n.id}
              onClick={() => router.push(n.href)}
              title={n.label}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: collapsed ? '11px 0' : '11px 12px', justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 'var(--r-md)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)',
                fontWeight: on ? 700 : 600, fontSize: 14.5,
                background: on ? 'var(--primary-soft)' : 'transparent', color: on ? 'var(--primary)' : 'var(--text-muted)',
                position: 'relative', transition: 'background .12s',
              }}
              onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'var(--bg)'; }}
              onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon name={n.icon} size={21} stroke={on ? 2.4 : 2} />
              {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{n.label}</span>}
              {on && !collapsed && <span style={{ position: 'absolute', right: 10, width: 6, height: 6, borderRadius: 99, background: 'var(--primary)' }} />}
            </button>
          );
        })}
      </div>

      <div style={{ padding: collapsed ? '12px' : '14px', borderTop: '1px solid var(--border)' }}>
        {!collapsed && (
          <button
            onClick={switchMode}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', marginBottom: 8, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--bg)', cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12.5 }}
          >
            <Icon name={isAdmin ? 'user' : 'lock'} size={15} /> Ver como {isAdmin ? 'autônomo' : 'admin'}
          </button>
        )}
        {!collapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 8px', borderRadius: 'var(--r-md)' }}>
            <Avatar ini={footUser.ini} cor={isAdmin ? 'var(--stage-nego)' : undefined} size={38} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{footUser.nome}</div>
              <div style={{ fontSize: 12, color: 'var(--text-subtle)' }}>{footUser.sub}</div>
            </div>
            <button onClick={() => router.push(profileHref)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-subtle)', display: 'flex' }}>
              <Icon name="settings" size={18} />
            </button>
          </div>
        ) : (
          <button onClick={() => router.push(profileHref)} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Avatar ini={footUser.ini} cor={isAdmin ? 'var(--stage-nego)' : undefined} size={36} />
          </button>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          style={{ marginTop: 8, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '9px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', color: 'var(--text-subtle)', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 12.5 }}
        >
          <Icon name={collapsed ? 'chevR' : 'chevL'} size={16} />
          {!collapsed && 'Recolher'}
        </button>
      </div>
    </div>
  );
}
