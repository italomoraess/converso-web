import { api } from "@/lib/axios";
import { apiLeadToLocal } from "@/lib/mappers";
import type { Lead, ApiLead } from "@/types";

export const leadsService = {
  list: async (): Promise<Lead[]> => {
    const res = await api.get<ApiLead[]>("/leads");
    return res.data.map(apiLeadToLocal);
  },

  getById: async (id: string): Promise<Lead> => {
    const res = await api.get<ApiLead>(`/leads/${id}`);
    return apiLeadToLocal(res.data);
  },

  create: async (body: Record<string, unknown>): Promise<Lead> => {
    const res = await api.post<ApiLead>("/leads", body);
    return apiLeadToLocal(res.data);
  },

  update: async (id: string, body: Record<string, unknown>): Promise<Lead> => {
    const res = await api.patch<ApiLead>(`/leads/${id}`, body);
    return apiLeadToLocal(res.data);
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },

  updateStage: async (
    id: string,
    stage: string,
    lostReason?: string
  ): Promise<Lead> => {
    const body: Record<string, unknown> = { funnelStage: stage };
    if (lostReason) body.lostReason = lostReason;
    const res = await api.patch<ApiLead>(`/leads/${id}/stage`, body);
    return apiLeadToLocal(res.data);
  },
};
