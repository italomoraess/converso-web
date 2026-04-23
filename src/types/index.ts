export type LeadOrigin =
  | "Instagram"
  | "Indicação"
  | "Facebook"
  | "WhatsApp"
  | "Site"
  | "Telefone"
  | "Tráfego pago"
  | "Rua"
  | "Outro";

export type FunnelStage =
  | "Novo Lead"
  | "Em Contato"
  | "Proposta Enviada"
  | "Em Negociação"
  | "Fechado"
  | "Perdido";

export type TaskType =
  | "Ligação"
  | "Visita"
  | "Reunião"
  | "Retornar proposta"
  | "Outro";

export type TransactionType = "entrada" | "saida";

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  cpfCnpj?: string;
  email?: string;
  origem: LeadOrigin;
  localizacao?: string;
  observacoes?: string;
  vendaRecorrente: boolean;
  stage: FunnelStage;
  motivoPerdido?: string;
  dealValue?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  date: string;
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
  leadId?: string;
  leadName?: string;
  notes?: string;
  completed: boolean;
  createdAt: string;
}

export interface CatalogCategory {
  id: string;
  name: string;
  createdAt: string;
}

export interface CatalogProduct {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  durationDays?: number;
  createdAt: string;
}

export interface FinanceCategory {
  id: string;
  name: string;
  type: TransactionType;
  color?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  value: number;
  description: string;
  category: string;
  categoryId?: string;
  date: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  plan?: string;
  trialEndsAt?: string;
  stripeSubscriptionStatus?: string | null;
  hasAccess?: boolean;
  subscriptionCancelAtPeriodEnd?: boolean;
  subscriptionPeriodEnd?: string | null;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export const FUNNEL_STAGES: FunnelStage[] = [
  "Novo Lead",
  "Em Contato",
  "Proposta Enviada",
  "Em Negociação",
  "Fechado",
  "Perdido",
];

export const LEAD_ORIGINS: LeadOrigin[] = [
  "Instagram",
  "Indicação",
  "Facebook",
  "WhatsApp",
  "Site",
  "Telefone",
  "Tráfego pago",
  "Rua",
  "Outro",
];

export const TASK_TYPES: TaskType[] = [
  "Ligação",
  "Visita",
  "Reunião",
  "Retornar proposta",
  "Outro",
];

// API types (snake_case from backend)
export interface ApiLead {
  id: string;
  name: string;
  phone: string;
  cpfCnpj?: string;
  email?: string;
  origin: string;
  location?: string;
  observations?: string;
  recurringSale: boolean;
  funnelStage: string;
  dealValue?: string;
  lostReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiAppointment {
  id: string;
  title: string;
  type: string;
  date: string;
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
  leadId?: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  lead?: { id: string; name: string; phone: string };
}

export interface ApiFinanceCategory {
  id: string;
  name: string;
  type: TransactionType;
  color?: string;
  createdAt: string;
}

export interface ApiTransaction {
  id: string;
  categoryId: string;
  type: TransactionType;
  amount: string;
  description?: string;
  date: string;
  createdAt: string;
  category?: ApiFinanceCategory;
}

export interface ApiProduct {
  id: string;
  categoryId: string;
  name: string;
  price: string;
  durationDays?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReportsSummary {
  totalLeads: number;
  newLeadsThisMonth: number;
  closedLeads: number;
  conversionRate: number;
  totalRevenue: number;
  byStage: Record<string, number>;
  byOrigin: Record<string, number>;
  weeklyTrend: Array<{ date: string; count: number }>;
}

export interface FinanceSummary {
  income: number;
  expense: number;
  balance: number;
  byCategory: Array<{ name: string; amount: number; type: TransactionType }>;
}
