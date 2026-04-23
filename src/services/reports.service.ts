import { api } from "@/lib/axios";
import type { ReportsSummary } from "@/types";

export const reportsService = {
  summary: async (): Promise<ReportsSummary> => {
    const res = await api.get<ReportsSummary>("/reports/summary");
    return res.data;
  },
};
