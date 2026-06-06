'use client';
/* CONVERSO Web — Login (ported from web/auth.jsx WLogin). Splash → login flow. */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/lib/icon';
import { WButton, Wordmark, Field } from '@/components/ui';
import { BrandPanel } from '@/components/auth/BrandPanel';
import { Splash } from '@/components/auth/Splash';
import { roleStorage, type Role } from '@/lib/auth-storage';
import { authService } from '@/services';
import { USE_MOCK } from '@/lib/api';

const roles: { id: Role; label: string; icon: string }[] = [
  { id: 'autonomo', label: 'Autônomo', icon: 'user' },
  { id: 'admin', label: 'Administrador', icon: 'lock' },
];

export default function LoginPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [show, setShow] = useState(false);
  const [role, setRole] = useState<Role>('autonomo');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onAuth = async (r: Role) => {
    setErr(null);
    if (USE_MOCK) {
      roleStorage.set(r);
      router.push(r === 'admin' ? '/empresa' : '/dashboard');
      return;
    }
    if (!email || !senha) {
      setErr('Informe e-mail e senha.');
      return;
    }
    setBusy(true);
    try {
      const res = await authService.login(email.trim(), senha);
      const serverRole = res.user?.role ?? r;
      roleStorage.set(serverRole);
      router.push(serverRole === 'admin' ? '/empresa' : '/dashboard');
    } catch {
      setErr('E-mail ou senha inválidos.');
    } finally {
      setBusy(false);
    }
  };

  if (showSplash) return <Splash onDone={() => setShowSplash(false)} />;

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <BrandPanel>
        <Wordmark size={26} light />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 800, lineHeight: 1.15, letterSpacing: -0.8, maxWidth: 440 }}>
            Toda a sua rotina de autônomo em um só lugar.
          </div>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.82)', lineHeight: 1.6, marginTop: 18, maxWidth: 420 }}>
            Clientes, serviços, agenda e funil de vendas — do primeiro contato ao pagamento.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 30 }}>
            {['Agenda com confirmação automática', 'Funil visual de oportunidades', 'Receba por Pix direto no app'].map((b) => (
              <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 11, fontSize: 14.5, fontWeight: 600 }}>
                <span style={{ width: 24, height: 24, borderRadius: 99, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="check" size={15} stroke={3} />
                </span>
                {b}
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>© 2026 Converso · Feito para quem trabalha por conta</div>
      </BrandPanel>

      <div style={{ width: 480, flexShrink: 0, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 350 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>Entrar</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 8 }}>Bem-vinda de volta! Acesse sua conta.</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 22, padding: 4, background: 'var(--bg)', borderRadius: 'var(--r-md)' }}>
            {roles.map((r) => {
              const on = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px 0', borderRadius: 'calc(var(--r-md) - 3px)', cursor: 'pointer', border: 'none', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 13.5, background: on ? 'var(--surface)' : 'transparent', color: on ? 'var(--primary)' : 'var(--text-muted)', boxShadow: on ? 'var(--sh-sm)' : 'none', transition: 'all .15s' }}
                >
                  <Icon name={r.icon} size={16} /> {r.label}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 18 }}>
            <Field label="E-mail" icon="mail" value={email} onChange={setEmail} type="email" />
            <Field
              label="Senha"
              icon="lock"
              value={senha}
              onChange={setSenha}
              type={show ? 'text' : 'password'}
              right={
                <button onClick={() => setShow((s) => !s)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
                  <Icon name={show ? 'eyeOff' : 'eye'} size={18} color="var(--text-subtle)" />
                </button>
              }
            />
            <div style={{ textAlign: 'right', marginTop: -4 }}>
              <button style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>Esqueci minha senha</button>
            </div>
            {err && <div style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 600 }}>{err}</div>}
            <WButton size="lg" full icon="arrowR" onClick={() => onAuth(role)}>
              {busy ? 'Entrando…' : `Entrar${role === 'admin' ? ' como admin' : ''}`}
            </WButton>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-subtle)', fontSize: 13 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} /> ou <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <WButton size="lg" full variant="outline" icon="whatsapp" style={{ color: '#1FA855' }} onClick={() => onAuth(role)}>
              Continuar com WhatsApp
            </WButton>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
              Novo por aqui?{' '}
              <button onClick={() => router.push('/cadastro')} style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 14 }}>
                Criar conta grátis
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
