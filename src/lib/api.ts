/* CONVERSO Web — axios instance with JWT auth + refresh interceptor.
   Talks to the existing crm-api (NestJS). */
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from './auth-storage';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = tokenStorage.refresh;
  if (!refresh) return null;
  try {
    const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken: refresh });
    // crm-api envelopa as respostas em { data, message }.
    const payload = res.data?.data ?? res.data;
    const access = payload?.accessToken ?? payload?.access_token;
    if (access) {
      tokenStorage.set(access, payload?.refreshToken ?? payload?.refresh_token);
      return access;
    }
  } catch {
    /* fall through */
  }
  tokenStorage.clear();
  return null;
}

api.interceptors.response.use(
  (res) => {
    // Desembrulha o envelope global { data, message } da crm-api,
    // para que os serviços leiam o payload direto em `res.data`.
    const b = res.data;
    if (b && typeof b === 'object' && 'data' in b && 'message' in b) {
      res.data = (b as { data: unknown }).data;
    }
    return res;
  },
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      refreshing ??= refreshAccessToken().finally(() => {
        refreshing = null;
      });
      const token = await refreshing;
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  },
);
