import { api } from "@/lib/axios";
import { apiTxToLocal } from "@/lib/mappers";
import type { Transaction, FinanceCategory, FinanceSummary, TransactionType, ApiTransaction, ApiFinanceCategory } from "@/types";

export const financeService = {
  listCategories: async (type?: TransactionType): Promise<FinanceCategory[]> => {
    const res = await api.get<ApiFinanceCategory[]>("/finance/categories", {
      params: type ? { type } : undefined,
    });
    return res.data;
  },

  createCategory: async (body: { name: string; type: TransactionType }): Promise<FinanceCategory> => {
    const res = await api.post<ApiFinanceCategory>("/finance/categories", body);
    return res.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/finance/categories/${id}`);
  },

  listTransactions: async (params?: {
    type?: TransactionType;
    month?: number;
    year?: number;
  }): Promise<Transaction[]> => {
    const res = await api.get<ApiTransaction[]>("/finance/transactions", { params });
    return res.data.map(apiTxToLocal);
  },

  createTransaction: async (body: Record<string, unknown>): Promise<Transaction> => {
    const res = await api.post<ApiTransaction>("/finance/transactions", body);
    return apiTxToLocal(res.data);
  },

  updateTransaction: async (
    id: string,
    body: Record<string, unknown>
  ): Promise<Transaction> => {
    const res = await api.patch<ApiTransaction>(`/finance/transactions/${id}`, body);
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
