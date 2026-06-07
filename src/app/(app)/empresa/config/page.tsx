'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/lib/icon';
import { WButton, WCard, Field } from '@/components/ui';
import { useStore } from '@/components/app/store';
import { authService } from '@/services';

export default function EmpresaConfigPage() {
  const router = useRouter();
  const { setAppearanceOpen, empresa, equipe, updateCompany } = useStore();

  const [form, setForm] = useState({ nome: empresa.nome, meta: String(empresa.metaEquipe || '') });
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    setForm({ nome: empresa.nome, meta: String(empresa.metaEquipe || '') });
  }, [empresa.nome, empresa.metaEquipe]);

  const metaNum = Number(form.meta.replace(/[^\d]/g, '')) || 0;
  const dirty = form.nome !== empresa.nome || metaNum !== empresa.metaEquipe;
  const onSave = async () => {
    setSaving(true);
    try {
      await updateCompany({ nome: form.nome.trim() || empresa.nome, metaEquipe: metaNum });
    } finally {
      setSaving(false);
    }
  };

  const onLogout = async () => { await authService.logout(); router.push('/login'); };
  const toggleTweaks = () => setAppearanceOpen(true);

  return (
    <div style={{ padding: 28, maxWidth: 680 }}>
      <WCard pad={0} style={{ overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ height: 90, background: 'linear-gradient(135deg, var(--stage-nego), color-mix(in srgb, var(--stage-nego) 55%, #160f3a))' }} />
        <div style={{ padding: '0 24px 24px', marginTop: -34 }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: 'color-mix(in srgb, var(--stage-nego) 16%, white)', color: 'var(--stage-nego)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 26, fontFamily: 'var(--font-display)', border: '4px solid var(--surface)' }}>{empresa.adminIni}</div>
          <h3 style={{ fontSize: 21, fontWeight: 800, marginTop: 12 }}>{empresa.nome}</h3>
          <div style={{ fontSize: 13.5, color: 'var(--text-muted)', fontWeight: 600 }}>Administrado por {empresa.admin}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, background: 'color-mix(in srgb, var(--stage-nego) 12%, transparent)', color: 'var(--stage-nego)', padding: '6px 12px', borderRadius: 99, fontSize: 12.5, fontWeight: 800 }}><Icon name="sparkle" size={14} /> Plano {empresa.plano}</div>
        </div>
      </WCard>
      <WCard pad={24}>
        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Configurações da empresa</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
          <Field label="Nome da empresa" value={form.nome} onChange={(v) => setForm((f) => ({ ...f, nome: v }))} icon="briefcase" />
          <Field label="Responsável" value={empresa.admin} icon="user" hint="Definido pela conta do administrador." />
          <Field
            label="Meta mensal da equipe (R$)"
            value={form.meta}
            onChange={(v) => setForm((f) => ({ ...f, meta: v.replace(/[^\d]/g, '') }))}
            placeholder="45000"
            icon="target"
          />
          <Field label="Autônomos" value={equipe.length + ' profissionais'} icon="users" hint="Gerencie em Autônomos." />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
          <WButton size="sm" icon="check" onClick={onSave} disabled={!dirty || saving}>
            {saving ? 'Salvando…' : 'Salvar alterações'}
          </WButton>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
          <WButton variant="soft" icon="settings" onClick={toggleTweaks}>Aparência &amp; tema</WButton>
          <div style={{ flex: 1 }} />
          <WButton variant="danger" icon="logout" onClick={onLogout}>Sair</WButton>
        </div>
      </WCard>
    </div>
  );
}
