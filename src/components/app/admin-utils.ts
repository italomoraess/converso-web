/* CONVERSO Web — shared aggregation helpers for the empresa/admin views. */
import { CV, type Membro } from '@/lib/data';

export interface TeamAgg {
  ativos: Membro[];
  faturamento: number;
  clientes: number;
  negocios: number;
  ticket: number;
  meses: { m: string; v: number }[];
}

export function teamAgg(equipe: Membro[]): TeamAgg {
  const ativos = equipe.filter((p) => p.status === 'ativo');
  const faturamento = equipe.reduce((s, p) => s + p.receita, 0);
  const clientes = equipe.reduce((s, p) => s + p.clientes, 0);
  const negocios = equipe.reduce((s, p) => s + p.negocios, 0);
  const ticket = clientes ? Math.round(faturamento / clientes) : 0;
  const meses = CV.receitaMeses.map((m, i) => ({
    m: m.m,
    v: equipe.reduce((s, p) => s + (p.spark[i] || 0), 0),
  }));
  return { ativos, faturamento, clientes, negocios, ticket, meses };
}
