import { api } from "@/lib/axios";
import { apiProductToLocal } from "@/lib/mappers";
import type { CatalogCategory, CatalogProduct, ApiProduct } from "@/types";

export const catalogService = {
  listCategories: async (): Promise<CatalogCategory[]> => {
    const res = await api.get<CatalogCategory[]>("/catalog/categories");
    return res.data;
  },

  createCategory: async (name: string): Promise<CatalogCategory> => {
    const res = await api.post<CatalogCategory>("/catalog/categories", { name });
    return res.data;
  },

  updateCategory: async (id: string, name: string): Promise<CatalogCategory> => {
    const res = await api.patch<CatalogCategory>(`/catalog/categories/${id}`, { name });
    return res.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/catalog/categories/${id}`);
  },

  listProducts: async (): Promise<CatalogProduct[]> => {
    const res = await api.get<ApiProduct[]>("/catalog/products");
    return res.data.map(apiProductToLocal);
  },

  createProduct: async (body: Record<string, unknown>): Promise<CatalogProduct> => {
    const res = await api.post<ApiProduct>("/catalog/products", body);
    return apiProductToLocal(res.data);
  },

  updateProduct: async (
    id: string,
    body: Record<string, unknown>
  ): Promise<CatalogProduct> => {
    const res = await api.patch<ApiProduct>(`/catalog/products/${id}`, body);
    return apiProductToLocal(res.data);
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/catalog/products/${id}`);
  },
};
