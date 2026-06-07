'use client';
/* CONVERSO Web — app-wide store for the authenticated area.
   Single source of truth: loads from the service layer (crm-api) when
   NEXT_PUBLIC_USE_MOCK !== 'true', otherwise falls back to the bundled mock so
   the design stays reviewable without a backend. */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  CV,
  type Cliente,
  type Evento,
  type Membro,
  type Negocio,
  type Servico,
  type StageId,
} from '@/lib/data';
import { roleStorage, tokenStorage, type Role } from '@/lib/auth-storage';
import { USE_MOCK } from '@/lib/api';
import {
  authService,
  leadsService,
  catalogService,
  agendaService,
  reportsService,
  companyService,
  type DashboardKpis,
  type ApiMember,
} from '@/services';

export interface SvcForm {
  editing: Servico | null;
}

export interface Empresa {
  nome: string;
  admin: string;
  adminIni: string;
  plano: string;
  metaEquipe: number;
}

interface Store {
  role: Role;
  setRole: (r: Role) => void;
  collapsed: boolean;
  setCollapsed: (fn: (c: boolean) => boolean) => void;
  toast: string | null;
  flash: (msg: string) => void;
  loading: boolean;

  clientes: Cliente[];
  servicos: Servico[];
  negocios: Negocio[];
  agenda: Evento[];
  equipe: Membro[];
  kpis: DashboardKpis;
  receitaMeses: { m: string; v: number }[];
  sparkReceita: number[];
  empresa: Empresa;
  mesesLabels: string[];

  clienteById: (id: string) => Cliente;
  user: { nome: string; papel: string; email: string; ini: string; fone: string; cidade: string; plano: string };

  svcForm: SvcForm | null;
  setSvcForm: (f: SvcForm | null) => void;

  appearanceOpen: boolean;
  setAppearanceOpen: (v: boolean) => void;

  saveService: (f: Servico) => void;
  deleteService: (id: string) => void;
  moveDeal: (id: string, etapa: StageId) => void;
  addEvent: (ev: Omit<Evento, 'id'>) => void;
  inviteMember: (m: { nome?: string; email?: string; area: string }) => void;
  setMemberStatus: (id: string, status: 'ativo' | 'pendente' | 'inativo') => void;
  updateProfile: (p: { nome?: string; fone?: string; cidade?: string }) => Promise<void>;
  updateCompany: (c: { nome?: string; metaEquipe?: number }) => Promise<void>;
}

const Ctx = createContext<Store | null>(null);

const initials = (name: string) =>
  (name || '')
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

const MOCK_EMPRESA: Empresa = {
  nome: CV.empresa.nome,
  admin: CV.empresa.admin,
  adminIni: CV.empresa.adminIni,
  plano: CV.empresa.plano,
  metaEquipe: CV.empresa.metaEquipe,
};

const MOCK_USER = {
  nome: CV.user.nome,
  papel: CV.user.papel,
  email: CV.user.email,
  ini: CV.user.ini,
  fone: '(11) 98765-4321',
  cidade: CV.user.cidade,
  plano: CV.user.plano,
};

// ApiMember -> Membro (UI). Cores/iniciais derivadas no cliente.
const PALETTE = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#F43F5E'];
const colorFor = (id: string) => PALETTE[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length];
function memberToMembro(m: ApiMember): Membro {
  return {
    id: m.id,
    nome: m.nome,
    area: m.area ?? 'Outros',
    ini: initials(m.nome),
    cor: colorFor(m.id),
    status: m.status,
    receita: m.receita,
    clientes: m.clientes,
    negocios: m.negocios,
    conversao: m.conversao,
    servicos: m.servicos,
    desde: m.desde,
    spark: m.spark?.length ? m.spark : [0, 0, 0, 0, 0, 0],
  };
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => roleStorage.get());
  const [collapsed, setCollapsed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [loading, setLoading] = useState(!USE_MOCK);

  const [clientes, setClientes] = useState<Cliente[]>(USE_MOCK ? CV.clientes : []);
  const [servicos, setServicos] = useState<Servico[]>(USE_MOCK ? CV.servicos : []);
  const [negocios, setNegocios] = useState<Negocio[]>(USE_MOCK ? CV.negocios : []);
  const [agenda, setAgenda] = useState<Evento[]>(USE_MOCK ? CV.agenda : []);
  const [equipe, setEquipe] = useState<Membro[]>(USE_MOCK ? CV.equipe : []);
  const [kpis, setKpis] = useState<DashboardKpis>(USE_MOCK ? (CV.kpis as DashboardKpis) : {
    receitaMes: 0, receitaMeta: 5000, receitaDelta: 0, aReceber: 0,
    servicosAtivos: 0, negociosAbertos: 0, taxaConversao: 0, novosClientes: 0, agendaHoje: 0,
  });
  const [receitaMeses, setReceitaMeses] = useState<{ m: string; v: number }[]>(USE_MOCK ? CV.receitaMeses : []);
  const [sparkReceita, setSparkReceita] = useState<number[]>(USE_MOCK ? CV.sparkReceita : []);
  const [empresa, setEmpresa] = useState<Empresa>(MOCK_EMPRESA);
  const [companyMeses, setCompanyMeses] = useState<{ m: string; v: number }[]>([]);
  const [user, setUser] = useState(MOCK_USER);

  const [svcForm, setSvcForm] = useState<SvcForm | null>(null);
  const [appearanceOpen, setAppearanceOpen] = useState(false);

  const setRole = useCallback((r: Role) => {
    roleStorage.set(r);
    setRoleState(r);
  }, []);

  const flash = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  // ─── Carga inicial (modo real) ──────────────────────────────────────
  useEffect(() => {
    if (USE_MOCK) return;
    if (!tokenStorage.access) return; // o guard do layout cuida do redirect
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const [profile, leads, svc, ag, dash] = await Promise.all([
          authService.me().catch(() => null),
          leadsService.list().catch(() => []),
          catalogService.list().catch(() => []),
          agendaService.list().catch(() => []),
          reportsService.dashboard().catch(() => null),
        ]);
        if (!alive) return;

        if (profile) {
          setRoleState(profile.role);
          roleStorage.set(profile.role);
          setUser({
            nome: profile.name ?? profile.email,
            papel: profile.company ? `Admin · ${profile.company.name}` : 'Autônomo',
            email: profile.email,
            ini: initials(profile.name ?? profile.email),
            fone: profile.phone ?? '',
            cidade: profile.city ?? '',
            plano: profile.plan ?? 'Profissional',
          });
        }

        const { leadToCliente, leadToNegocio } = await import('@/lib/mappers');
        setClientes(leads.map(leadToCliente));
        setNegocios(leads.map(leadToNegocio));
        setServicos(svc);
        setAgenda(ag);
        if (dash) {
          setKpis(dash.kpis);
          setReceitaMeses(dash.receitaMeses);
          setSparkReceita(dash.sparkReceita);
        }

        // Dados de empresa só para admin (evita 403).
        if (profile?.role === 'admin') {
          const [co, members, summary] = await Promise.all([
            companyService.get().catch(() => null),
            companyService.members().catch(() => [] as ApiMember[]),
            companyService.summary().catch(() => null),
          ]);
          if (!alive) return;
          if (co) {
            setEmpresa({
              nome: co.name,
              admin: co.admin ?? '',
              adminIni: initials(co.admin ?? co.name),
              plano: co.plan,
              metaEquipe: co.monthlyGoal ?? 0,
            });
          }
          setEquipe(members.map(memberToMembro));
          if (summary) setCompanyMeses(summary.meses);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const clienteById = useCallback(
    (id: string): Cliente =>
      clientes.find((c) => c.id === id) || { id, nome: '—', ini: '?', cor: '#999', fone: '', email: '' },
    [clientes],
  );

  const reloadMembers = useCallback(async () => {
    const members = await companyService.members().catch(() => [] as ApiMember[]);
    setEquipe(members.map(memberToMembro));
  }, []);

  // ─── Mutators ───────────────────────────────────────────────────────
  const saveService = useCallback(
    async (f: Servico) => {
      const isEdit = !!f.id && servicos.some((s) => s.id === f.id);
      if (USE_MOCK) {
        if (isEdit) setServicos((l) => l.map((s) => (s.id === f.id ? f : s)));
        else setServicos((l) => [{ ...f, id: 's' + Date.now(), preco: +f.preco || 0 }, ...l]);
        setSvcForm(null);
        flash(isEdit ? 'Serviço atualizado ✓' : 'Serviço criado ✓');
        return;
      }
      try {
        const saved = isEdit ? await catalogService.update(f.id, f) : await catalogService.create(f);
        setServicos((l) => (isEdit ? l.map((s) => (s.id === saved.id ? saved : s)) : [saved, ...l]));
        setSvcForm(null);
        flash(isEdit ? 'Serviço atualizado ✓' : 'Serviço criado ✓');
      } catch {
        flash('Erro ao salvar serviço');
      }
    },
    [flash, servicos],
  );

  const deleteService = useCallback(
    async (id: string) => {
      if (!USE_MOCK) {
        try {
          await catalogService.remove(id);
        } catch {
          flash('Erro ao excluir');
          return;
        }
      }
      setServicos((l) => l.filter((s) => s.id !== id));
      setSvcForm(null);
      flash('Serviço excluído');
    },
    [flash],
  );

  const moveDeal = useCallback(
    (id: string, etapa: StageId) => {
      setNegocios((l) => l.map((d) => (d.id === id ? { ...d, etapa } : d)));
      if (!USE_MOCK) {
        leadsService.moveStage(id, etapa).catch(() => flash('Erro ao mover negócio'));
      }
    },
    [flash],
  );

  const addEvent = useCallback(
    async (ev: Omit<Evento, 'id'>) => {
      if (USE_MOCK) {
        setAgenda((l) => [...l, { ...ev, id: 'a' + Date.now() }]);
        flash('Agendamento confirmado ✓');
        return;
      }
      try {
        const now = new Date();
        const saved = await agendaService.create(ev, now.getFullYear(), now.getMonth());
        setAgenda((l) => [...l, saved]);
        flash('Agendamento confirmado ✓');
      } catch {
        flash('Erro ao agendar');
      }
    },
    [flash],
  );

  const inviteMember = useCallback(
    async (m: { nome?: string; email?: string; area: string }) => {
      if (USE_MOCK) {
        setEquipe((l) => [
          ...l,
          {
            id: 'p' + Date.now(), nome: m.nome || 'Convidado', area: m.area, ini: initials(m.nome || 'Novo'),
            cor: CV.catColor[m.area] || '#6366F1', status: 'pendente', receita: 0, clientes: 0,
            negocios: 0, conversao: 0, servicos: 0, desde: '2026', spark: [0, 0, 0, 0, 0, 0],
          },
        ]);
        flash('Convite enviado ✓');
        return;
      }
      try {
        await companyService.invite({ name: m.nome || 'Convidado', email: m.email || undefined, area: m.area });
        await reloadMembers();
        flash('Convite enviado ✓');
      } catch {
        flash('Erro ao convidar');
      }
    },
    [flash, reloadMembers],
  );

  const setMemberStatus = useCallback(
    async (id: string, status: 'ativo' | 'pendente' | 'inativo') => {
      setEquipe((l) => l.map((p) => (p.id === id ? { ...p, status } : p)));
      if (!USE_MOCK) {
        try {
          await companyService.updateMember(id, { status });
        } catch {
          flash('Erro ao atualizar membro');
          reloadMembers();
        }
      }
    },
    [flash, reloadMembers],
  );

  const updateProfile = useCallback(
    async (p: { nome?: string; fone?: string; cidade?: string }) => {
      const next = {
        ...(p.nome !== undefined ? { nome: p.nome } : {}),
        ...(p.fone !== undefined ? { fone: p.fone } : {}),
        ...(p.cidade !== undefined ? { cidade: p.cidade } : {}),
      };
      if (USE_MOCK) {
        setUser((u) => ({ ...u, ...next, ini: p.nome ? initials(p.nome) : u.ini }));
        flash('Dados salvos ✓');
        return;
      }
      try {
        const saved = await authService.updateProfile({ name: p.nome, phone: p.fone, city: p.cidade });
        setUser((u) => ({
          ...u,
          nome: saved.name ?? u.nome,
          ini: initials(saved.name ?? u.nome),
          fone: saved.phone ?? '',
          cidade: saved.city ?? '',
        }));
        flash('Dados salvos ✓');
      } catch {
        flash('Erro ao salvar dados');
      }
    },
    [flash],
  );

  const updateCompany = useCallback(
    async (c: { nome?: string; metaEquipe?: number }) => {
      if (USE_MOCK) {
        setEmpresa((e) => ({
          ...e,
          ...(c.nome !== undefined ? { nome: c.nome, adminIni: e.adminIni } : {}),
          ...(c.metaEquipe !== undefined ? { metaEquipe: c.metaEquipe } : {}),
        }));
        flash('Empresa atualizada ✓');
        return;
      }
      try {
        const saved = await companyService.update({ name: c.nome, monthlyGoal: c.metaEquipe });
        setEmpresa((e) => ({
          ...e,
          nome: saved.name,
          plano: saved.plan,
          metaEquipe: saved.monthlyGoal ?? e.metaEquipe,
        }));
        flash('Empresa atualizada ✓');
      } catch {
        flash('Erro ao atualizar empresa');
      }
    },
    [flash],
  );

  const mesesLabels = useMemo(
    () =>
      (companyMeses.length ? companyMeses : receitaMeses.length ? receitaMeses : CV.receitaMeses).map((m) => m.m),
    [companyMeses, receitaMeses],
  );

  const value = useMemo<Store>(
    () => ({
      role, setRole, collapsed, setCollapsed, toast, flash, loading,
      clientes, servicos, negocios, agenda, equipe, kpis, receitaMeses, sparkReceita, empresa, mesesLabels,
      clienteById, user,
      svcForm, setSvcForm,
      appearanceOpen, setAppearanceOpen,
      saveService, deleteService, moveDeal, addEvent, inviteMember, setMemberStatus, updateProfile, updateCompany,
    }),
    [role, setRole, collapsed, toast, flash, loading, clientes, servicos, negocios, agenda, equipe, kpis, receitaMeses, sparkReceita, empresa, mesesLabels, clienteById, user, svcForm, appearanceOpen, saveService, deleteService, moveDeal, addEvent, inviteMember, setMemberStatus, updateProfile, updateCompany],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used within AppStoreProvider');
  return ctx;
}
