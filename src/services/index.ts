/* CONVERSO Web — service layer over crm-api (NestJS).
   Each function returns UI-domain shapes via the mappers; the store calls these. */
import { api } from '@/lib/api';
import { tokenStorage, type Role } from '@/lib/auth-storage';
import {
  leadToCliente,
  leadToNegocio,
  productToServico,
  appointmentToEvento,
  eventoToAppointmentBody,
  servicoToProductBody,
  stageToApi,
  type ApiLead,
  type ApiProduct,
  type ApiAppointment,
} from '@/lib/mappers';
import type { StageId, Servico, Evento } from '@/lib/data';

/* ---------------- Auth / profile ---------------- */
export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  city?: string | null;
  plan?: string;
  role: Role;
  company: { id: string; name: string; role: string } | null;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user?: UserProfile;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResult> {
    const { data } = await api.post<AuthResult>('/auth/login', { email, password });
    tokenStorage.set(data.accessToken, data.refreshToken);
    return data;
  },
  async register(body: { name: string; email: string; password: string; phone?: string }): Promise<AuthResult> {
    const { data } = await api.post<AuthResult>('/auth/register', body);
    tokenStorage.set(data.accessToken, data.refreshToken);
    return data;
  },
  async me(): Promise<UserProfile> {
    const { data } = await api.get<UserProfile>('/auth/me');
    return data;
  },
  async updateProfile(body: { name?: string; phone?: string; city?: string }): Promise<UserProfile> {
    const { data } = await api.patch<UserProfile>('/auth/me', body);
    return data;
  },
  async logout() {
    try {
      await api.post('/auth/logout', { refreshToken: tokenStorage.refresh });
    } finally {
      tokenStorage.clear();
    }
  },
};

/* ---------------- Leads (funil + clientes) ---------------- */
export const leadsService = {
  async list(params?: { stage?: StageId; search?: string }) {
    const { data } = await api.get<ApiLead[]>('/leads', {
      params: { stage: params?.stage ? stageToApi(params.stage) : undefined, search: params?.search },
    });
    return data;
  },
  async negocios() {
    return (await leadsService.list()).map(leadToNegocio);
  },
  async clientes() {
    return (await leadsService.list()).map(leadToCliente);
  },
  async moveStage(id: string, stage: StageId) {
    const { data } = await api.patch<ApiLead>(`/leads/${id}/stage`, { funnelStage: stageToApi(stage) });
    return leadToNegocio(data);
  },
  async create(body: { name: string; phone: string; email?: string; dealValue?: number }) {
    const { data } = await api.post<ApiLead>('/leads', body);
    return data;
  },
};

/* ---------------- Catalog (serviços) ---------------- */
export const catalogService = {
  async list() {
    const { data } = await api.get<ApiProduct[]>('/catalog/products');
    return data.map(productToServico);
  },
  async categories() {
    const { data } = await api.get<{ id: string; name: string }[]>('/catalog/categories');
    return data;
  },
  /** Garante que a categoria existe (por nome) e devolve o id. */
  async ensureCategory(name: string): Promise<string> {
    const cats = await catalogService.categories();
    const found = cats.find((c) => c.name === name);
    if (found) return found.id;
    const { data } = await api.post<{ id: string }>('/catalog/categories', { name });
    return data.id;
  },
  async create(s: Servico) {
    const categoryId = await catalogService.ensureCategory(s.cat);
    const { data } = await api.post<ApiProduct>('/catalog/products', servicoToProductBody({ ...s, categoryId }));
    return productToServico(data);
  },
  async update(id: string, s: Servico) {
    const categoryId = await catalogService.ensureCategory(s.cat);
    const { data } = await api.patch<ApiProduct>(`/catalog/products/${id}`, servicoToProductBody({ ...s, categoryId }));
    return productToServico(data);
  },
  async remove(id: string) {
    await api.delete(`/catalog/products/${id}`);
  },
};

/* ---------------- Appointments (agenda) ---------------- */
export const agendaService = {
  async list() {
    const { data } = await api.get<ApiAppointment[]>('/appointments');
    return data.map(appointmentToEvento);
  },
  async create(ev: Omit<Evento, 'id'>, year: number, month: number) {
    const { data } = await api.post<ApiAppointment>('/appointments', eventoToAppointmentBody(ev, year, month));
    return appointmentToEvento(data);
  },
};

/* ---------------- Reports (dashboard) ---------------- */
export interface DashboardKpis {
  receitaMes: number;
  receitaMeta: number;
  receitaDelta: number;
  aReceber: number;
  servicosAtivos: number;
  negociosAbertos: number;
  taxaConversao: number;
  novosClientes: number;
  agendaHoje: number;
}
export interface DashboardData {
  kpis: DashboardKpis;
  receitaMeses: { m: string; v: number }[];
  sparkReceita: number[];
}

export const reportsService = {
  async dashboard(): Promise<DashboardData> {
    const { data } = await api.get<DashboardData>('/reports/dashboard');
    return data;
  },
};

/* ---------------- Billing (Stripe Checkout) ---------------- */
export const billingService = {
  /** Cria a sessão de checkout (assinatura) e retorna a URL hospedada do Stripe. */
  async checkout(): Promise<{ url: string }> {
    const { data } = await api.post<{ url: string }>('/billing/checkout-session', {});
    return data;
  },
};

/* ---------------- Company (empresa / admin) ---------------- */
export interface ApiMember {
  id: string;
  userId: string | null;
  nome: string;
  email: string | null;
  area: string | null;
  role: string;
  status: 'ativo' | 'pendente' | 'inativo';
  receita: number;
  clientes: number;
  negocios: number;
  conversao: number;
  servicos: number;
  desde: string;
  spark: number[];
}
export interface ApiCompany {
  id: string;
  name: string;
  plan: string;
  monthlyGoal: number | null;
  admin: string | null;
}

export const companyService = {
  async get() {
    const { data } = await api.get<ApiCompany>('/company');
    return data;
  },
  async update(body: { name?: string; plan?: string; monthlyGoal?: number }) {
    const { data } = await api.patch<ApiCompany>('/company', body);
    return data;
  },
  async members() {
    const { data } = await api.get<ApiMember[]>('/company/members');
    return data;
  },
  async summary() {
    const { data } = await api.get('/company/summary');
    return data as {
      faturamento: number;
      clientes: number;
      negocios: number;
      ticket: number;
      ativos: number;
      total: number;
      pctMeta: number;
      meses: { m: string; v: number }[];
      porArea: { area: string; receita: number }[];
      company: { id: string; name: string; plan: string; monthlyGoal: number | null };
    };
  },
  async invite(body: { name: string; email?: string; area?: string }) {
    const { data } = await api.post<ApiMember>('/company/members', body);
    return data;
  },
  async updateMember(id: string, body: { status?: string; area?: string; role?: string }) {
    const { data } = await api.patch<ApiMember>(`/company/members/${id}`, body);
    return data;
  },
  async removeMember(id: string) {
    await api.delete(`/company/members/${id}`);
  },
};

export type { Role };
