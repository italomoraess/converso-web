import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { FunnelStage, LeadOrigin } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export function formatDateFull(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getWhatsAppUrl(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${intl}`;
}

export function getStageBadgeStyle(stage: FunnelStage): {
  bg: string;
  text: string;
  label: string;
} {
  switch (stage) {
    case "New Lead":
      return { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-300", label: "Novo Lead" };
    case "In Contact":
      return { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-800 dark:text-amber-300", label: "Em Contato" };
    case "Proposal Sent":
      return { bg: "bg-violet-100 dark:bg-violet-950", text: "text-violet-700 dark:text-violet-300", label: "Proposta Enviada" };
    case "Negotiating":
      return { bg: "bg-pink-100 dark:bg-pink-950", text: "text-pink-700 dark:text-pink-300", label: "Em Negociação" };
    case "Closed":
      return { bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-300", label: "Fechado ✓" };
    case "Lost":
      return { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400", label: "Perdido" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-600", label: stage };
  }
}

export function getOriginBadgeStyle(origin: LeadOrigin): {
  bg: string;
  text: string;
} {
  switch (origin) {
    case "Instagram":
      return { bg: "bg-pink-100 dark:bg-pink-950", text: "text-pink-700 dark:text-pink-300" };
    case "Referral":
      return { bg: "bg-emerald-100 dark:bg-emerald-950", text: "text-emerald-700 dark:text-emerald-300" };
    case "Facebook":
      return { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-300" };
    case "WhatsApp":
      return { bg: "bg-green-100 dark:bg-green-950", text: "text-green-700 dark:text-green-300" };
    case "Site":
      return { bg: "bg-cyan-100 dark:bg-cyan-950", text: "text-cyan-700 dark:text-cyan-300" };
    case "Phone":
      return { bg: "bg-indigo-100 dark:bg-indigo-950", text: "text-indigo-700 dark:text-indigo-300" };
    case "PaidTraffic":
      return { bg: "bg-blue-100 dark:bg-blue-950", text: "text-blue-700 dark:text-blue-300" };
    case "Street":
      return { bg: "bg-amber-100 dark:bg-amber-950", text: "text-amber-700 dark:text-amber-300" };
    default:
      return { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400" };
  }
}

export function getKanbanColumnColor(stage: FunnelStage): string {
  switch (stage) {
    case "New Lead": return "#1a56db";
    case "In Contact": return "#f59e0b";
    case "Proposal Sent": return "#8b5cf6";
    case "Negotiating": return "#ec4899";
    case "Closed": return "#10b981";
    case "Lost": return "#6b7280";
    default: return "#6b7280";
  }
}

export function getInitials(name?: string, email?: string): string {
  const source = name ?? email ?? "?";
  return source
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
