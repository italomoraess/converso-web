import { api } from "@/lib/axios";
import { apiApptToLocal } from "@/lib/mappers";
import type { Task, ApiAppointment } from "@/types";

export const appointmentsService = {
  list: async (params?: { month?: number; year?: number }): Promise<Task[]> => {
    const res = await api.get<ApiAppointment[]>("/appointments", { params });
    return res.data.map(apiApptToLocal);
  },

  upcoming: async (): Promise<Task[]> => {
    const res = await api.get<ApiAppointment[]>("/appointments/upcoming");
    return res.data.map(apiApptToLocal);
  },

  byDate: async (date: string): Promise<Task[]> => {
    const res = await api.get<ApiAppointment[]>(`/appointments/date/${date}`);
    return res.data.map(apiApptToLocal);
  },

  create: async (body: Record<string, unknown>): Promise<Task> => {
    const res = await api.post<ApiAppointment>("/appointments", body);
    return apiApptToLocal(res.data);
  },

  update: async (id: string, body: Record<string, unknown>): Promise<Task> => {
    const res = await api.patch<ApiAppointment>(`/appointments/${id}`, body);
    return apiApptToLocal(res.data);
  },

  complete: async (id: string): Promise<Task> => {
    const res = await api.patch<ApiAppointment>(`/appointments/${id}/complete`);
    return apiApptToLocal(res.data);
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },
};
