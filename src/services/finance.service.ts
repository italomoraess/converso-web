import { api } from "@/lib/axios";
import { apiTxToLocal, txTypeToApi } from "@/lib/mappers";
import type { Transaction, FinanceCategory, FinanceSummary, TransactionType, ApiTransaction, ApiFinanceCategory } from "@/types";

export const financeService = {
  listCategories: async (type?: TransactionType): Promise<FinanceCategory[]> => {
    const res = await api.get<ApiFinanceCategory[]>("/finance/categories", {
      params: type ? { type: txTypeToApi[type] } : undefined,
    });
    return res.data.map((c) => ({ ...c, type: c.type === "entrada" ? "income" : "expense" }) as FinanceCategory);
  },

  createCategory: async (body: { name: string; type: TransactionType }): Promise<FinanceCategory> => {
    const res = await api.post<ApiFinanceCategory>("/finance/categories", {
      ...body,
      type: txTypeToApi[body.type],
    });
    return { ...res.data, type: res.data.type === "entrada" ? "income" : "expense" } as FinanceCategory;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/finance/categories/${id}`);
  },

  listTransactions: async (params?: {
    type?: TransactionType;
    month?: number;
    year?: number;
  }): Promise<Transaction[]> => {
    const apiParams = params
      ? { ...params, type: params.type ? txTypeToApi[params.type] : undefined }
      : undefined;
    const res = await api.get<ApiTransaction[]>("/finance/transactions", { params: apiParams });
    return res.data.map(apiTxToLocal);
  },

  createTransaction: async (body: Record<string, unknown>): Promise<Transaction> => {
    const apiBody = { ...body };
    if (apiBody.type === "income") apiBody.type = "entrada";
    if (apiBody.type === "expense") apiBody.type = "saida";
    const res = await api.post<ApiTransaction>("/finance/transactions", apiBody);
    return apiTxToLocal(res.data);
  },

  updateTransaction: async (id: string, body: Record<string, unknown>): Promise<Transaction> => {
    const apiBody = { ...body };
    if (apiBody.type === "income") apiBody.type = "entrada";
    if (apiBody.type === "expense") apiBody.type = "saida";
    const res = await api.patch<ApiTransaction>(`/finance/transactions/${id}`, apiBody);
    return apiTxToLocal(res.data);
  },

  deleteTransaction: async (id: string): Promise<void> => {
    await api.delete(`/finance/transactions/${id}`);
  },

  summary: async (params?: { month?: number; year?: number }): Promise<FinanceSummary> => {
    const res = await api.get<FinanceSummary>("/finance/summary", { params });
    return res.data;
  },
};
