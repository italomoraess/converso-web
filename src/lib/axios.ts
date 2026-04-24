import axios, { type AxiosError } from "axios";
import { getAccessToken } from "./token-store";
import { getApiErrorMessage } from "./axios-public";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const ENVELOPE_KEYS = new Set(["data", "message", "success", "statusCode", "error"]);

function unwrapEnvelope(payload: unknown): unknown {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return payload;
  }
  const record = payload as Record<string, unknown>;
  if (!("data" in record)) return payload;
  const keys = Object.keys(record);
  if (keys.length === 0 || !keys.every((k) => ENVELOPE_KEYS.has(k))) return payload;
  return record.data;
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 60_000,
});

// Attach Bearer token synchronously from the module-level store
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    response.data = unwrapEnvelope(response.data);
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 402) {
      if (typeof window !== "undefined") {
        window.location.href = "/subscription";
      }
      return Promise.reject(new Error("Plano ativo necessário."));
    }

    if (error.response?.status === 401) {
      // Token invalid — NextAuth session is stale, force re-login
      if (typeof window !== "undefined") {
        const { signOut } = await import("next-auth/react");
        await signOut({ callbackUrl: "/login" });
      }
      return Promise.reject(new Error("Sessão expirada. Faça login novamente."));
    }

    const data = error.response?.data;
    const msg =
      data && typeof data === "object" && "message" in data
        ? getApiErrorMessage(data)
        : error.message;
    return Promise.reject(new Error(msg || "Erro inesperado."));
  }
);
