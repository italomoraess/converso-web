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
  category?: { id: string; name: string } | null;
  categoryId?: string;
}

export function productToServico(p: ApiProduct): Servico {
  return {
    id: p.id,
    nome: p.name,
    cat: p.category?.name ?? 'Consultoria',
    preco: Number(p.price),
    dur: p.durationDays ? `${p.durationDays}d` : '1h',
    status: 'ativo',
    cliente: '',
    desc: '',
  };
}

export function servicoToProductBody(s: Partial<Servico> & { categoryId?: string }) {
  return {
    name: s.nome,
    price: typeof s.preco === 'string' ? parseFloat(s.preco) : s.preco,
    categoryId: s.categoryId,
  };
}

// ---- Appointment (crm-api) <-> Evento (UI) ----
export interface ApiAppointment {
  id: string;
  title: string;
  date: string; // ISO date
  startTime?: string | null;
  completed?: boolean;
  type?: string;
  leadId?: string | null;
}

export function appointmentToEvento(a: ApiAppointment): Evento {
  const day = new Date(a.date).getDate();
  return {
    id: a.id,
    dia: day,
    hora: a.startTime ?? '09:00',
    dur: 60,
    titulo: a.title,
    cliente: a.leadId ?? '',
    tipo: a.type ?? 'Consultoria',
    status: a.completed ? 'confirmado' : 'pendente',
  };
}
