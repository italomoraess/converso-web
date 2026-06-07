'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/lib/icon';
import { WButton, WCard, Field } from '@/components/ui';
import { useStore } from '@/components/app/store';
import { authService } from '@/services';

/* Preferências de notificação — persistidas localmente (não há backend dedicado). */
const NOTIF_KEY = 'cv:notif-prefs';
type NotifPrefs = { push: boolean; email: boolean; whatsapp: boolean };
const DEFAULT_NOTIF: NotifPrefs = { push: true, email: true, whatsapp: false };

interface ToggleProps {
  on: boolean;
  onClick: () => void;
}

interface RowProps {
  icon: string;
  title: string;
  sub?: string;
  right?: ReactNode;
  last?: boolean;
}

export default function PerfilPage() {
  const router = useRouter();
  const { setAppearanceOpen, user, servicos, clientes, negocios, updateProfile } = useStore();
  const u = user;

  // ── Dados da conta (form controlado) ──
  const [form, setForm] = useState({ nome: u.nome, fone: u.fone, cidade: u.cidade });
  const [saving, setSaving] = useState(false);
  // Re-sincroniza quando o store termina de carregar o perfil real.
  useEffect(() => {
    setForm({ nome: u.nome, fone: u.fone, cidade: u.cidade });
  }, [u.nome, u.fone, u.cidade]);
  const dirty = form.nome !== u.nome || form.fone !== u.fone || form.cidade !== u.cidade;
  const onSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
    } finally {
      setSaving(false);
    }
  };

  // ── Notificações (persistidas em localStorage) ──
  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULT_NOTIF);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTIF_KEY);
      if (raw) setPrefs({ ...DEFAULT_NOTIF, ...JSON.parse(raw) });
    } catch {
      /* ignora json inválido */
    }
  }, []);
  const togglePref = (k: keyof NotifPrefs) =>
    setPrefs((p) => {
      const next = { ...p, [k]: !p[k] };
      try {
        localStorage.setItem(NOTIF_KEY, JSON.stringify(next));
      } catch {
        /* storage indisponível */
      }
      return next;
    });

  const Toggle = ({ on, onClick }: ToggleProps) => (
    <button
      onClick={onClick}
      style={{
        width: 46,
        height: 27,
        borderRadius: 99,
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        background: on ? 'var(--primary)' : 'var(--border-strong)',
        transition: 'background .2s',
        flexShrink: 0,
      } satisfies CSSProperties}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 22 : 3,
          width: 21,
          height: 21,
          borderRadius: 99,
          background: '#fff',
          transition: 'left .2s',
          boxShadow: '0 1px 3px rgba(0,0,0,.2)',
        } satisfies CSSProperties}
      />
    </button>
  );

  const Row = ({ icon, title, sub, right, last }: RowProps) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '15px 0',
        borderBottom: last ? 'none' : '1px solid var(--border)',
      } satisfies CSSProperties}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: 'var(--primary-soft)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        } satisfies CSSProperties}
      >
        <Icon name={icon} size={19} stroke={2.1} />
      </div>
      <div style={{ flex: 1 } satisfies CSSProperties}>
        <div style={{ fontWeight: 700, fontSize: 14.5 } satisfies CSSProperties}>{title}</div>
        {sub && (
          <div style={{ fontSize: 12.5, color: 'var(--text-subtle)', marginTop: 1 } satisfies CSSProperties}>
            {sub}
          </div>
        )}
      </div>
      {right}
    </div>
  );

  return (
    <div
      style={{
        padding: 28,
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: 20,
        alignItems: 'start',
      } satisfies CSSProperties}
    >
      {/* profile summary */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 } satisfies CSSProperties}>
        <WCard pad={0} style={{ overflow: 'hidden' }}>
          <div
            style={{
              height: 92,
              background: 'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 52%, #160f3a))',
            } satisfies CSSProperties}
          />
          <div style={{ padding: '0 22px 22px', marginTop: -40 } satisfies CSSProperties}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'var(--primary-soft)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 30,
                fontFamily: 'var(--font-display)',
                border: '4px solid var(--surface)',
              } satisfies CSSProperties}
            >
              {u.ini}
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginTop: 12 }}>{u.nome}</h3>
            <div style={{ fontSize: 13.5, color: 'var(--text-muted)', fontWeight: 600 } satisfies CSSProperties}>
              {u.papel}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                color: 'var(--text-subtle)',
                marginTop: 8,
                fontWeight: 600,
              } satisfies CSSProperties}
            >
              <Icon name="pin" size={15} /> {u.cidade || 'Cidade não informada'}
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 14,
                background: 'var(--primary-soft)',
                color: 'var(--primary)',
                padding: '6px 12px',
                borderRadius: 99,
                fontSize: 12.5,
                fontWeight: 800,
              } satisfies CSSProperties}
            >
              <Icon name="sparkle" size={14} /> Plano {u.plano}
            </div>
          </div>
        </WCard>

        <WCard pad={20}>
          <div
            style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' } satisfies CSSProperties}
          >
            {([['Serviços', servicos.length], ['Clientes', clientes.length], ['Negócios', negocios.length]] as [string, number][]).map(
              ([l, v]) => (
                <div key={l}>
                  <div
                    className="cv-num"
                    style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)' } satisfies CSSProperties}
                  >
                    {v}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-subtle)', fontWeight: 600 } satisfies CSSProperties}>
                    {l}
                  </div>
                </div>
              ),
            )}
          </div>
        </WCard>

        <WButton
          variant="danger"
          icon="logout"
          full
          size="lg"
          onClick={async () => {
            await authService.logout();
            router.push('/login');
          }}
        >
          Sair da conta
        </WButton>
      </div>

      {/* settings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 } satisfies CSSProperties}>
        <WCard pad={24}>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Dados da conta</h3>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 } satisfies CSSProperties}
          >
            <Field label="Nome" value={form.nome} onChange={(v) => setForm((f) => ({ ...f, nome: v }))} />
            <Field label="E-mail" value={u.email} icon="mail" hint="O e-mail de acesso não pode ser alterado aqui." />
            <Field
              label="Telefone"
              value={form.fone}
              onChange={(v) => setForm((f) => ({ ...f, fone: v }))}
              placeholder="(11) 98765-4321"
              icon="phone"
            />
            <Field
              label="Cidade"
              value={form.cidade}
              onChange={(v) => setForm((f) => ({ ...f, cidade: v }))}
              placeholder="São Paulo, SP"
              icon="pin"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 } satisfies CSSProperties}>
            <WButton size="sm" icon="check" onClick={onSave} disabled={!dirty || saving}>
              {saving ? 'Salvando…' : 'Salvar dados'}
            </WButton>
          </div>
        </WCard>

        <WCard pad={24}>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Notificações</h3>
          <Row
            icon="bell"
            title="Notificações push"
            sub="Lembretes de agenda e novos leads"
            right={<Toggle on={prefs.push} onClick={() => togglePref('push')} />}
          />
          <Row
            icon="mail"
            title="Resumo por e-mail"
            sub="Receba o fechamento diário"
            right={<Toggle on={prefs.email} onClick={() => togglePref('email')} />}
          />
          <Row
            icon="whatsapp"
            title="Confirmação por WhatsApp"
            sub="Avise clientes automaticamente"
            right={<Toggle on={prefs.whatsapp} onClick={() => togglePref('whatsapp')} />}
            last
          />
        </WCard>

        <WCard pad={24}>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Preferências</h3>
          <Row
            icon="settings"
            title="Aparência & tema"
            sub="Cor, modo escuro, tipografia"
            right={
              <WButton size="sm" variant="soft" onClick={() => setAppearanceOpen(true)}>
                Ajustar
              </WButton>
            }
            last
          />
        </WCard>
      </div>
    </div>
  );
}
