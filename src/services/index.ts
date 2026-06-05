/* CONVERSO Web — service layer over crm-api (NestJS).
   Each function returns UI-domain shapes via the mappers. Screens currently
   render the bundled mock store for design review; swap the store mutators for
   these calls (or use them inside TanStack Query hooks) to go fully live. */
import { api } from '@/lib/api';
import { tokenStorage, type Role } from '@/lib/auth-storage';
import {
  leadToCliente,
  leadToNegocio,
  productToServico,
  appointmentToEvento,
  servicoToProductBody,
  stageToApi,
  type ApiLead,
  type ApiProduct,
  type ApiAppointment,
} from '@/lib/mappers';
import type { StageId, Servico } from '@/lib/data';

/* ---------------- Auth ---------------- */
export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user?: { id: string; email: string; name?: string };
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
  async me() {
    const { data } = await api.get('/auth/me');
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
    const { data } = await api.patch<ApiLead>(`/leads/${id}/stage`, { stage: stageToApi(stage) });
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
  async create(s: Partial<Servico> & { categoryId: string }) {
    const { data } = await api.post<ApiProduct>('/catalog/products', servicoToProductBody(s));
    return productToServico(data);
  },
  async update(id: string, s: Partial<Servico> & { categoryId?: string }) {
    const { data } = await api.patch<ApiProduct>(`/catalog/products/${id}`, servicoToProductBody(s));
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
  async byDate(date: string) {
    const { data } = await api.get<ApiAppointment[]>(`/appointments/date/${date}`);
    return data.map(appointmentToEvento);
  },
  async create(body: { title: string; date: string; startTime?: string; leadId?: string; type?: string }) {
    const { data } = await api.post<ApiAppointment>('/appointments', body);
    return appointmentToEvento(data);
  },
};

/* ---------------- Reports (dashboard) ---------------- */
export const reportsService = {
  async summary(from?: string, to?: string) {
    const { data } = await api.get('/reports/summary', { params: { from, to } });
    return data;
  },
};

export type { Role };
