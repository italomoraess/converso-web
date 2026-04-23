import type {
  Lead,
  FunnelStage,
  LeadOrigin,
  Task,
  TaskType,
  Transaction,
  CatalogProduct,
  ApiLead,
  ApiAppointment,
  ApiTransaction,
  ApiProduct,
} from "@/types";

export const stageFromApi: Record<string, FunnelStage> = {
  novo: "Novo Lead",
  contatado: "Em Contato",
  negociando: "Em Negociação",
  fechado: "Fechado",
  perdido: "Perdido",
};

export const stageToApi: Record<FunnelStage, string> = {
  "Novo Lead": "novo",
  "Em Contato": "contatado",
  "Proposta Enviada": "negociando",
  "Em Negociação": "negociando",
  Fechado: "fechado",
  Perdido: "perdido",
};

export const originFromApi: Record<string, LeadOrigin> = {
  instagram: "Instagram",
  indicacao: "Indicação",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  site: "Site",
  telefone: "Telefone",
  outro: "Outro",
};

export const originToApi: Record<LeadOrigin, string> = {
  Instagram: "instagram",
  Indicação: "indicacao",
  Facebook: "facebook",
  WhatsApp: "whatsapp",
  Site: "site",
  Telefone: "telefone",
  "Tráfego pago": "outro",
  Rua: "outro",
  Outro: "outro",
};

export const taskTypeFromApi: Record<string, TaskType> = {
  ligacao: "Ligação",
  visita: "Visita",
  reuniao: "Reunião",
  retorno: "Retornar proposta",
  outro: "Outro",
};

export const taskTypeToApi: Record<TaskType, string> = {
  Ligação: "ligacao",
  Visita: "visita",
  Reunião: "reuniao",
  "Retornar proposta": "retorno",
  Outro: "outro",
};

export function apiLeadToLocal(a: ApiLead): Lead {
  return {
    id: a.id,
    nome: a.name,
    telefone: a.phone,
    cpfCnpj: a.cpfCnpj,
    email: a.email,
    origem: originFromApi[a.origin] ?? "Outro",
    localizacao: a.location,
    observacoes: a.observations,
    vendaRecorrente: a.recurringSale,
    stage: stageFromApi[a.funnelStage] ?? "Novo Lead",
    motivoPerdido: a.lostReason ?? undefined,
    dealValue: a.dealValue ? parseFloat(a.dealValue) : undefined,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  };
}

export function localLeadToApi(
  lead: Partial<Omit<Lead, "id" | "createdAt" | "updatedAt">>
): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (lead.nome !== undefined) body.name = lead.nome;
  if (lead.telefone !== undefined) body.phone = lead.telefone;
  if (lead.cpfCnpj !== undefined) body.cpfCnpj = lead.cpfCnpj;
  if (lead.email !== undefined) body.email = lead.email;
  if (lead.origem !== undefined) body.origin = originToApi[lead.origem] ?? "outro";
  if (lead.localizacao !== undefined) body.location = lead.localizacao;
  if (lead.observacoes !== undefined) body.observations = lead.observacoes;
  if (lead.vendaRecorrente !== undefined) body.recurringSale = lead.vendaRecorrente;
  if (lead.stage !== undefined) body.funnelStage = stageToApi[lead.stage] ?? "novo";
  if (lead.motivoPerdido !== undefined) body.lostReason = lead.motivoPerdido;
  if (lead.dealValue !== undefined) body.dealValue = lead.dealValue;
  return body;
}

export function apiApptToLocal(a: ApiAppointment): Task {
  return {
    id: a.id,
    title: a.title,
    type: taskTypeFromApi[a.type] ?? "Outro",
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
    type: t.type,
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
