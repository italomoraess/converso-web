'use client';
/* CONVERSO Web — app-wide store for the authenticated area.
   Single source of truth: loads all data from the service layer (crm-api). */
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
  ultimosMeses,
  type Cliente,
  type Evento,
  type Membro,
  type Negocio,
  type Servico,
  type StageId,
} from '@/lib/data';
import { roleStorage, tokenStorage, type Role } from '@/lib/auth-storage';
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

  clienteFormOpen: boolean;
  setClienteFormOpen: (v: boolean) => void;

  appearanceOpen: boolean;
  setAppearanceOpen: (v: boolean) => void;

  saveService: (f: Servico) => void;
  deleteService: (id: string) => void;
  addCliente: (d: { nome: string; fone: string; email?: string }) => Promise<void>;
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

const EMPTY_EMPRESA: Empresa = { nome: '', admin: '', adminIni: '', plano: '', metaEquipe: 0 };

const EMPTY_USER = { nome: '', papel: '', email: '', ini: '', fone: '', cidade: '', plano: '' };

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
  const [loading, setLoading] = useState(true);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [agenda, setAgenda] = useState<Evento[]>([]);
  const [equipe, setEquipe] = useState<Membro[]>([]);
  const [kpis, setKpis] = useState<DashboardKpis>({
    receitaMes: 0, receitaMeta: 5000, receitaDelta: 0, aReceber: 0,
    servicosAtivos: 0, negociosAbertos: 0, taxaConversao: 0, novosClientes: 0, agendaHoje: 0,
  });
  const [receitaMeses, setReceitaMeses] = useState<{ m: string; v: number }[]>([]);
  const [sparkReceita, setSparkReceita] = useState<number[]>([]);
  const [empresa, setEmpresa] = useState<Empresa>(EMPTY_EMPRESA);
  const [companyMeses, setCompanyMeses] = useState<{ m: string; v: number }[]>([]);
  const [user, setUser] = useState(EMPTY_USER);

  const [svcForm, setSvcForm] = useState<SvcForm | null>(null);
  const [clienteFormOpen, setClienteFormOpen] = useState(false);
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

  // ─── Carga inicial ──────────────────────────────────────────────────
  useEffect(() => {
    if (!tokenStorage.access) {
      setLoading(false);
      return; // o guard do layout cuida do redirect
    }
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
      try {
        await catalogService.remove(id);
      } catch {
        flash('Erro ao excluir');
        return;
      }
      setServicos((l) => l.filter((s) => s.id !== id));
      setSvcForm(null);
      flash('Serviço excluído');
    },
    [flash],
  );

  const addCliente = useCallback(
    async (d: { nome: string; fone: string; email?: string }) => {
      const nome = d.nome.trim();
      if (!nome) return;
      try {
        const lead = await leadsService.create({ name: nome, phone: d.fone.trim(), email: d.email?.trim() || undefined });
        const { leadToCliente, leadToNegocio } = await import('@/lib/mappers');
        setClientes((l) => [leadToCliente(lead), ...l]);
        setNegocios((l) => [leadToNegocio(lead), ...l]);
        setClienteFormOpen(false);
        flash('Cliente cadastrado ✓');
      } catch {
        flash('Erro ao cadastrar cliente');
      }
    },
    [flash],
  );

  const moveDeal = useCallback(
    (id: string, etapa: StageId) => {
      setNegocios((l) => l.map((d) => (d.id === id ? { ...d, etapa } : d)));
      leadsService.moveStage(id, etapa).catch(() => flash('Erro ao mover negócio'));
    },
    [flash],
  );

  const addEvent = useCallback(
    async (ev: Omit<Evento, 'id'>) => {
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
      try {
        await companyService.updateMember(id, { status });
      } catch {
        flash('Erro ao atualizar membro');
        reloadMembers();
      }
    },
    [flash, reloadMembers],
  );

  const updateProfile = useCallback(
    async (p: { nome?: string; fone?: string; cidade?: string }) => {
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
    () => {
      const src = companyMeses.length ? companyMeses : receitaMeses;
      return src.length ? src.map((m) => m.m) : ultimosMeses();
    },
    [companyMeses, receitaMeses],
  );

  const value = useMemo<Store>(
    () => ({
      role, setRole, collapsed, setCollapsed, toast, flash, loading,
      clientes, servicos, negocios, agenda, equipe, kpis, receitaMeses, sparkReceita, empresa, mesesLabels,
      clienteById, user,
      svcForm, setSvcForm,
      clienteFormOpen, setClienteFormOpen,
      appearanceOpen, setAppearanceOpen,
      saveService, deleteService, addCliente, moveDeal, addEvent, inviteMember, setMemberStatus, updateProfile, updateCompany,
    }),
    [role, setRole, collapsed, toast, flash, loading, clientes, servicos, negocios, agenda, equipe, kpis, receitaMeses, sparkReceita, empresa, mesesLabels, clienteById, user, svcForm, clienteFormOpen, appearanceOpen, saveService, deleteService, addCliente, moveDeal, addEvent, inviteMember, setMemberStatus, updateProfile, updateCompany],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used within AppStoreProvider');
  return ctx;
}
