'use client';
/* CONVERSO Web — Cadastro (ported from web/auth.jsx WCadastro). */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WButton, Wordmark, Field } from '@/components/ui';
import { BrandPanel } from '@/components/auth/BrandPanel';
import { roleStorage } from '@/lib/auth-storage';
import { authService } from '@/services';
import { USE_MOCK } from '@/lib/api';

const atividades = ['Beleza & Estética', 'Reparos & Serviços', 'Saúde & Bem-estar', 'Criativo / Freelancer', 'Consultoria', 'Educação'];

export default function CadastroPage() {
  const router = useRouter();
  const [f, setF] = useState({ nome: '', email: '', fone: '', senha: '', atividade: '' });
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onAuth = async () => {
    setErr(null);
    if (USE_MOCK) {
      roleStorage.set('autonomo');
      router.push('/dashboard');
      return;
    }
    if (!f.nome || !f.email || !f.senha) {
      setErr('Preencha nome, e-mail e senha.');
      return;
    }
    if (f.senha.length < 8 || !/(?=.*[A-Z])(?=.*\d)/.test(f.senha)) {
      setErr('Senha: mínimo 8 caracteres, com 1 maiúscula e 1 número.');
      return;
    }
    setBusy(true);
    try {
      const res = await authService.register({
        name: f.nome.trim(),
        email: f.email.trim(),
        password: f.senha,
        phone: f.fone || undefined,
      });
      roleStorage.set(res.user?.role ?? 'autonomo');
      router.push((res.user?.role ?? 'autonomo') === 'admin' ? '/empresa' : '/dashboard');
    } catch {
      setErr('Não foi possível criar a conta. O e-mail pode já estar em uso.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <BrandPanel>
        <Wordmark size={26} light />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 800, lineHeight: 1.15, letterSpacing: -0.8, maxWidth: 440 }}>
            Comece grátis em menos de um minuto.
          </div>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.82)', lineHeight: 1.6, marginTop: 18, maxWidth: 420 }}>
            Sem cartão de crédito. Organize seus atendimentos hoje mesmo.
          </p>
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>© 2026 Converso</div>
      </BrandPanel>

      <div style={{ width: 520, flexShrink: 0, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>Criar conta</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 8 }}>Preencha seus dados para começar.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginTop: 26 }}>
            <Field label="Nome completo" icon="user" value={f.nome} onChange={set('nome')} placeholder="Seu nome" />
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <Field label="E-mail" icon="mail" value={f.email} onChange={set('email')} placeholder="voce@email.com" />
              </div>
            </div>
            <Field label="WhatsApp" icon="phone" value={f.fone} onChange={set('fone')} placeholder="(11) 90000-0000" />
            <Field label="Senha" icon="lock" value={f.senha} onChange={set('senha')} type="password" hint="Mínimo de 8 caracteres" />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>Área de atuação</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {atividades.map((a) => {
                  const on = f.atividade === a;
                  return (
                    <button
                      key={a}
                      onClick={() => set('atividade')(a)}
                      style={{ padding: '9px 13px', borderRadius: 99, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 12.5, border: 'none', background: on ? 'var(--primary-soft)' : 'var(--bg)', color: on ? 'var(--primary)' : 'var(--text-muted)', boxShadow: on ? 'inset 0 0 0 1.5px var(--primary)' : 'none' }}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
            {err && <div style={{ color: 'var(--danger)', fontSize: 13, fontWeight: 600 }}>{err}</div>}
            <WButton size="lg" full icon="check" onClick={onAuth} style={{ marginTop: 4 }}>
              {busy ? 'Criando…' : 'Criar conta e começar'}
            </WButton>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
              Já tem conta?{' '}
              <button onClick={() => router.push('/login')} style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 14 }}>
                Entrar
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
