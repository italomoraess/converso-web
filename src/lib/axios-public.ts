import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type NestBody<T> = { data: T; message?: string };

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

export function getApiErrorMessage(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const d = data as Record<string, unknown>;
  if (typeof d.message === "string") return d.message;
  if (Array.isArray(d.message)) return d.message.join(", ");
  return "";
}

export const publicClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 60_000,
});

publicClient.interceptors.response.use(
  (response) => {
    response.data = unwrapEnvelope(response.data);
    return response;
  },
  (error) => {
    const data = error.response?.data;
    const msg =
      data && typeof data === "object" && "message" in data
        ? getApiErrorMessage(data)
        : error.message;
    return Promise.reject(new Error(msg || "Erro inesperado."));
  }
);
