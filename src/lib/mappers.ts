import type {
  Lead,
  FunnelStage,
  LeadOrigin,
  Task,
  TaskType,
  Transaction,
  TransactionType,
  ApiTransactionType,
  CatalogProduct,
  ApiLead,
  ApiAppointment,
  ApiTransaction,
  ApiProduct,
} from "@/types";

export const stageFromApi: Record<string, FunnelStage> = {
  novo: "New Lead",
  contatado: "In Contact",
  negociando: "Negotiating",
  proposta: "Proposal Sent",
  fechado: "Closed",
  perdido: "Lost",
};

export const stageToApi: Record<FunnelStage, string> = {
  "New Lead": "novo",
  "In Contact": "contatado",
  "Proposal Sent": "negociando",
  "Negotiating": "negociando",
  "Closed": "fechado",
  "Lost": "perdido",
};

export const originFromApi: Record<string, LeadOrigin> = {
  instagram: "Instagram",
  indicacao: "Referral",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  site: "Site",
  telefone: "Phone",
  outro: "Other",
};

export const originToApi: Record<LeadOrigin, string> = {
  Instagram: "instagram",
  Referral: "indicacao",
  Facebook: "facebook",
  WhatsApp: "whatsapp",
  Site: "site",
  Phone: "telefone",
  PaidTraffic: "outro",
  Street: "outro",
  Other: "outro",
};

export const taskTypeFromApi: Record<string, TaskType> = {
  ligacao: "Call",
  visita: "Visit",
  reuniao: "Meeting",
  retorno: "Follow Up",
  outro: "Other",
};

export const taskTypeToApi: Record<TaskType, string> = {
  Call: "ligacao",
  Visit: "visita",
  Meeting: "reuniao",
  "Follow Up": "retorno",
  Other: "outro",
};

export const txTypeFromApi: Record<ApiTransactionType, TransactionType> = {
  entrada: "income",
  saida: "expense",
};

export const txTypeToApi: Record<TransactionType, ApiTransactionType> = {
  income: "entrada",
  expense: "saida",
};

export function apiLeadToLocal(a: ApiLead): Lead {
  return {
    id: a.id,
    name: a.name,
    phone: a.phone,
    taxId: a.cpfCnpj,
    email: a.email,
    origin: originFromApi[a.origin] ?? "Other",
    location: a.location,
    notes: a.observations,
    recurringDeal: a.recurringSale,
    stage: stageFromApi[a.funnelStage] ?? "New Lead",
    lostReason: a.lostReason ?? undefined,
    dealValue: a.dealValue ? parseFloat(a.dealValue) : undefined,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  };
}

export function localLeadToApi(
  lead: Partial<Omit<Lead, "id" | "createdAt" | "updatedAt">>
): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (lead.name !== undefined) body.name = lead.name;
  if (lead.phone !== undefined) body.phone = lead.phone;
  if (lead.taxId !== undefined) body.cpfCnpj = lead.taxId;
  if (lead.email !== undefined) body.email = lead.email;
  if (lead.origin !== undefined) body.origin = originToApi[lead.origin] ?? "outro";
  if (lead.location !== undefined) body.location = lead.location;
  if (lead.notes !== undefined) body.observations = lead.notes;
  if (lead.recurringDeal !== undefined) body.recurringSale = lead.recurringDeal;
  if (lead.stage !== undefined) body.funnelStage = stageToApi[lead.stage] ?? "novo";
  if (lead.lostReason !== undefined) body.lostReason = lead.lostReason;
  if (lead.dealValue !== undefined) body.dealValue = lead.dealValue;
  return body;
}

export function apiApptToLocal(a: ApiAppointment): Task {
  return {
    id: a.id,
    title: a.title,
    type: taskTypeFromApi[a.type] ?? "Other",
    date: a.date.slice(0, 10),
    startTime: a.startTime,
    endTime: a.endTime,
    allDay: a.allDay,
    leadId: a.leadId,
    leadName: a.lead?.name,
    notes: a.description,
    completed: a.completed,
    createdAt: a.createdAt,
  };
}

export function localTaskToApi(
  task: Partial<Omit<Task, "id" | "createdAt">>
): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (task.title !== undefined) body.title = task.title;
  if (task.type !== undefined) body.type = taskTypeToApi[task.type] ?? "outro";
  if (task.date !== undefined) body.date = task.date;
  if (task.leadId !== undefined) body.leadId = task.leadId;
  if (task.notes !== undefined) body.description = task.notes;
  if (task.startTime !== undefined) body.startTime = task.startTime;
  if (task.endTime !== undefined) body.endTime = task.endTime;
  if (task.allDay !== undefined) body.allDay = task.allDay;
  return body;
}

export function apiTxToLocal(t: ApiTransaction): Transaction {
  return {
    id: t.id,
    type: txTypeFromApi[t.type] ?? "income",
    value: parseFloat(t.amount),
    description: t.description ?? "",
    category: t.category?.name ?? t.categoryId,
    categoryId: t.categoryId,
    date: t.date.slice(0, 10),
    createdAt: t.createdAt,
  };
}

export function apiProductToLocal(p: ApiProduct): CatalogProduct {
  return {
    id: p.id,
    categoryId: p.categoryId,
    name: p.name,
    price: parseFloat(p.price),
    durationDays: p.durationDays,
    createdAt: p.createdAt,
  };
}
