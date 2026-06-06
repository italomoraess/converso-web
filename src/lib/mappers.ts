/* CONVERSO Web — mapping between the design domain (PT-BR, used across the UI)
   and the crm-api wire format (snake_case-ish JSON from the NestJS/Prisma API).

   Funnel stages — the layout uses 5 columns:
     lead → contato → prop(Proposta) → nego(Negociação) → ganho(Fechado)
   The current crm-api enum is: novo, contatado, negociando, fechado, perdido.
   To match the layout 1:1 the API should gain a `proposta` stage (see
   crm-api/ADAPTATIONS.md). Until then we map prop→negociando on the way out. */

import type { StageId, Negocio, Servico, Evento, Cliente } from './data';

// ---- Funnel stage ----
export type ApiStage = 'novo' | 'contatado' | 'proposta' | 'negociando' | 'fechado' | 'perdido';

const STAGE_TO_API: Record<StageId, ApiStage> = {
  lead: 'novo',
  contato: 'contatado',
  prop: 'proposta',
  nego: 'negociando',
  ganho: 'fechado',
};

const API_TO_STAGE: Record<ApiStage, StageId> = {
  novo: 'lead',
  contatado: 'contato',
  proposta: 'prop',
  negociando: 'nego',
  fechado: 'ganho',
  perdido: 'ganho', // lost deals are not a column in the layout; surfaced via lostReason
};

export const stageToApi = (s: StageId): ApiStage => STAGE_TO_API[s];
export const stageFromApi = (s: string): StageId => API_TO_STAGE[(s as ApiStage)] ?? 'lead';

// ---- Helpers ----
const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

const PALETTE = ['#0EA5E9', '#8B5CF6', '#F59E0B', '#10B981', '#F43F5E', '#6366F1', '#EC4899'];
const colorFor = (id: string) => PALETTE[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length];

// ---- Lead (crm-api) -> Cliente / Negocio (UI) ----
export interface ApiLead {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  funnelStage: string;
  dealValue?: string | number | null;
  origin?: string;
  observations?: string | null;
}

export function leadToCliente(l: ApiLead): Cliente {
  return { id: l.id, nome: l.name, fone: l.phone, email: l.email ?? '', ini: initials(l.name), cor: colorFor(l.id) };
}

export function leadToNegocio(l: ApiLead): Negocio {
  return {
    id: l.id,
    titulo: l.name,
    cliente: l.id,
    valor: Number(l.dealValue ?? 0),
    etapa: stageFromApi(l.funnelStage),
    dias: 0,
    servico: l.observations ?? '',
  };
}

// ---- CatalogProduct (crm-api) <-> Servico (UI) ----
export interface ApiProduct {
  id: string;
  name: string;
  price: string | number;
  durationDays?: number | null;
  duration?: string | null;
  description?: string | null;
  status?: 'ativo' | 'pausado' | 'rascunho' | null;
  category?: { id: string; name: string } | null;
  categoryId?: string;
}

export function productToServico(p: ApiProduct): Servico {
  return {
    id: p.id,
    nome: p.name,
    cat: p.category?.name ?? 'Consultoria',
    preco: Number(p.price),
    dur: p.duration ?? (p.durationDays ? `${p.durationDays}d` : '1h'),
    status: p.status ?? 'ativo',
    cliente: '',
    desc: p.description ?? '',
  };
}

export function servicoToProductBody(s: Partial<Servico> & { categoryId?: string }) {
  return {
    name: s.nome,
    price: typeof s.preco === 'string' ? parseFloat(s.preco) : s.preco,
    duration: s.dur,
    description: s.desc,
    status: s.status,
    categoryId: s.categoryId,
  };
}

// ---- Appointment (crm-api) <-> Evento (UI) ----
export interface ApiAppointment {
  id: string;
  title: string;
  date: string; // ISO date (YYYY-MM-DD…)
  startTime?: string | null;
  durationMinutes?: number | null;
  serviceCategory?: string | null;
  completed?: boolean;
  type?: string;
  leadId?: string | null;
}

/** Evento (UI) -> corpo de criação de Appointment (API). `dia` é o dia do mês;
 *  combinamos com o ano/mês informados (a tela mostra o mês corrente). */
export function eventoToAppointmentBody(
  ev: Omit<Evento, 'id'>,
  year: number,
  month: number, // 0-based
) {
  const dd = String(ev.dia).padStart(2, '0');
  const mm = String(month + 1).padStart(2, '0');
  return {
    title: ev.titulo,
    date: `${year}-${mm}-${dd}`,
    startTime: ev.hora,
    durationMinutes: ev.dur,
    serviceCategory: ev.tipo,
    leadId: ev.cliente || undefined,
  };
}

export function appointmentToEvento(a: ApiAppointment): Evento {
  // a.date vem como "YYYY-MM-DD" — extrair o dia sem passar por Date (evita
  // deslocamento de fuso que mudaria o dia do mês).
  const day = Number(a.date.slice(8, 10)) || new Date(a.date).getUTCDate();
  return {
    id: a.id,
    dia: day,
    hora: a.startTime ?? '09:00',
    dur: a.durationMinutes ?? 60,
    titulo: a.title,
    cliente: a.leadId ?? '',
    tipo: a.serviceCategory ?? a.type ?? 'Consultoria',
    status: a.completed ? 'confirmado' : 'pendente',
  };
}
