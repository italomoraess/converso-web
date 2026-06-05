'use client';
import { useRouter } from 'next/navigation';
import { Icon } from '@/lib/icon';
import { CV, fmtBRL } from '@/lib/data';
import { WButton, WCard, Field } from '@/components/ui';
import { useStore } from '@/components/app/store';
import { tokenStorage } from '@/lib/auth-storage';

export default function EmpresaConfigPage() {
  const router = useRouter();
  const { setAppearanceOpen } = useStore();

  const onLogout = () => { tokenStorage.clear(); router.push('/login'); };
  const toggleTweaks = () => setAppearanceOpen(true);

  return (
    <div style={{ padding: 28, maxWidth: 680 }}>
      <WCard pad={0} style={{ overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ height: 90, background: 'linear-gradient(135deg, var(--stage-nego), color-mix(in srgb, var(--stage-nego) 55%, #160f3a))' }} />
        <div style={{ padding: '0 24px 24px', marginTop: -34 }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: 'color-mix(in srgb, var(--stage-nego) 16%, white)', color: 'var(--stage-nego)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 26, fontFamily: 'var(--font-display)', border: '4px solid var(--surface)' }}>{CV.empresa.adminIni}</div>
          <h3 style={{ fontSize: 21, fontWeight: 800, marginTop: 12 }}>{CV.empresa.nome}</h3>
          <div style={{ fontSize: 13.5, color: 'var(--text-muted)', fontWeight: 600 }}>Administrado por {CV.empresa.admin}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, background: 'color-mix(in srgb, var(--stage-nego) 12%, transparent)', color: 'var(--stage-nego)', padding: '6px 12px', borderRadius: 99, fontSize: 12.5, fontWeight: 800 }}><Icon name="sparkle" size={14} /> Plano {CV.empresa.plano}</div>
        </div>
      </WCard>
      <WCard pad={24}>
        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Configurações da empresa</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 14 }}>
          <Field label="Nome da empresa" value={CV.empresa.nome} icon="briefcase" />
          <Field label="Responsável" value={CV.empresa.admin} icon="user" />
          <Field label="Meta mensal da equipe" value={fmtBRL(CV.empresa.metaEquipe)} icon="target" />
          <Field label="Autônomos" value={CV.equipe.length + ' profissionais'} icon="users" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 22 }}>
          <WButton variant="soft" icon="settings" onClick={toggleTweaks}>Aparência &amp; tema</WButton>
          <div style={{ flex: 1 }} />
          <WButton variant="danger" icon="logout" onClick={onLogout}>Sair</WButton>
        </div>
      </WCard>
    </div>
  );
}
