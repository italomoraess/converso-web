export type LeadOrigin =
  | "Instagram"
  | "Referral"
  | "Facebook"
  | "WhatsApp"
  | "Site"
  | "Phone"
  | "PaidTraffic"
  | "Street"
  | "Other";

export type FunnelStage =
  | "New Lead"
  | "In Contact"
  | "Proposal Sent"
  | "Negotiating"
  | "Closed"
  | "Lost";

export type TaskType =
  | "Call"
  | "Visit"
  | "Meeting"
  | "Follow Up"
  | "Other";

export type TransactionType = "income" | "expense";

export type ApiTransactionType = "entrada" | "saida";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  taxId?: string;
  email?: string;
  origin: LeadOrigin;
  location?: string;
  notes?: string;
  recurringDeal: boolean;
  stage: FunnelStage;
  lostReason?: string;
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
  "New Lead",
  "In Contact",
  "Proposal Sent",
  "Negotiating",
  "Closed",
  "Lost",
];

export const FUNNEL_STAGE_LABELS: Record<FunnelStage, string> = {
  "New Lead": "Novo Lead",
  "In Contact": "Em Contato",
  "Proposal Sent": "Proposta Enviada",
  "Negotiating": "Em Negociação",
  "Closed": "Fechado",
  "Lost": "Perdido",
};

export const LEAD_ORIGINS: LeadOrigin[] = [
  "Instagram",
  "Referral",
  "Facebook",
  "WhatsApp",
  "Site",
  "Phone",
  "PaidTraffic",
  "Street",
  "Other",
];

export const LEAD_ORIGIN_LABELS: Record<LeadOrigin, string> = {
  Instagram: "Instagram",
  Referral: "Indicação",
  Facebook: "Facebook",
  WhatsApp: "WhatsApp",
  Site: "Site",
  Phone: "Telefone",
  PaidTraffic: "Tráfego pago",
  Street: "Rua",
  Other: "Outro",
};

export const TASK_TYPES: TaskType[] = [
  "Call",
  "Visit",
  "Meeting",
  "Follow Up",
  "Other",
];

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  Call: "Ligação",
  Visit: "Visita",
  Meeting: "Reunião",
  "Follow Up": "Retornar proposta",
  Other: "Outro",
};

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
  type: ApiTransactionType;
  color?: string;
  createdAt: string;
}

export interface ApiTransaction {
  id: string;
  categoryId: string;
  type: ApiTransactionType;
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
  byCategory: Array<{ name: string; amount: number; type: ApiTransactionType }>;
}
