'use client';
/* CONVERSO Web — app-wide store for the authenticated area.
   Mirrors the prototype's top-level state: collections + mutators + toast.
   Uses bundled mock data so the app is fully interactive without a backend;
   swap the mutators for the service layer in src/services to go live. */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { CV, type Evento, type Membro, type Negocio, type Servico, type StageId } from '@/lib/data';
import { roleStorage, type Role } from '@/lib/auth-storage';

export interface SvcForm {
  editing: Servico | null;
}

interface Store {
  role: Role;
  setRole: (r: Role) => void;
  collapsed: boolean;
  setCollapsed: (fn: (c: boolean) => boolean) => void;
  toast: string | null;
  flash: (msg: string) => void;

  servicos: Servico[];
  negocios: Negocio[];
  agenda: Evento[];
  equipe: Membro[];

  svcForm: SvcForm | null;
  setSvcForm: (f: SvcForm | null) => void;

  appearanceOpen: boolean;
  setAppearanceOpen: (v: boolean) => void;

  saveService: (f: Servico) => void;
  deleteService: (id: string) => void;
  moveDeal: (id: string, etapa: StageId) => void;
  addEvent: (ev: Omit<Evento, 'id'>) => void;
  inviteMember: (m: { nome?: string; email?: string; area: string }) => void;
}

const Ctx = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(() => roleStorage.get());
  const [collapsed, setCollapsed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [servicos, setServicos] = useState<Servico[]>(CV.servicos);
  const [negocios, setNegocios] = useState<Negocio[]>(CV.negocios);
  const [agenda, setAgenda] = useState<Evento[]>(CV.agenda);
  const [equipe, setEquipe] = useState<Membro[]>(CV.equipe);
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

  const saveService = useCallback(
    (f: Servico) => {
      if (f.id) setServicos((l) => l.map((s) => (s.id === f.id ? f : s)));
      else setServicos((l) => [{ ...f, id: 's' + Date.now(), preco: +f.preco || 0 }, ...l]);
      setSvcForm(null);
      flash(f.id ? 'Serviço atualizado ✓' : 'Serviço criado ✓');
    },
    [flash],
  );

  const deleteService = useCallback(
    (id: string) => {
      setServicos((l) => l.filter((s) => s.id !== id));
      setSvcForm(null);
      flash('Serviço excluído');
    },
    [flash],
  );

  const moveDeal = useCallback((id: string, etapa: StageId) => {
    setNegocios((l) => l.map((d) => (d.id === id ? { ...d, etapa } : d)));
  }, []);

  const addEvent = useCallback(
    (ev: Omit<Evento, 'id'>) => {
      setAgenda((l) => [...l, { ...ev, id: 'a' + Date.now() }]);
      flash('Agendamento confirmado ✓');
    },
    [flash],
  );

  const inviteMember = useCallback(
    (m: { nome?: string; email?: string; area: string }) => {
      const ini = (m.nome || 'Novo')
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
      setEquipe((l) => [
        ...l,
        {
          id: 'p' + Date.now(),
          nome: m.nome || 'Convidado',
          area: m.area,
          ini,
          cor: CV.catColor[m.area] || '#6366F1',
          status: 'pendente',
          receita: 0,
          clientes: 0,
          negocios: 0,
          conversao: 0,
          servicos: 0,
          desde: '2026',
          spark: [0, 0, 0, 0, 0, 0],
        },
      ]);
      flash('Convite enviado ✓');
    },
    [flash],
  );

  const value = useMemo<Store>(
    () => ({
      role, setRole, collapsed, setCollapsed, toast, flash,
      servicos, negocios, agenda, equipe,
      svcForm, setSvcForm,
      appearanceOpen, setAppearanceOpen,
      saveService, deleteService, moveDeal, addEvent, inviteMember,
    }),
    [role, setRole, collapsed, toast, flash, servicos, negocios, agenda, equipe, svcForm, appearanceOpen, saveService, deleteService, moveDeal, addEvent, inviteMember],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used within AppStoreProvider');
  return ctx;
}
