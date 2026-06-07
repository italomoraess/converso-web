/* CONVERSO Web — shared aggregation helpers for the empresa/admin views. */
import { ultimosMeses, type Membro } from '@/lib/data';

export interface TeamAgg {
  ativos: Membro[];
  faturamento: number;
  clientes: number;
  negocios: number;
  ticket: number;
  meses: { m: string; v: number }[];
}

export function teamAgg(equipe: Membro[], mesesLabels?: string[]): TeamAgg {
  const ativos = equipe.filter((p) => p.status === 'ativo');
  const faturamento = equipe.reduce((s, p) => s + p.receita, 0);
  const clientes = equipe.reduce((s, p) => s + p.clientes, 0);
  const negocios = equipe.reduce((s, p) => s + p.negocios, 0);
  const ticket = clientes ? Math.round(faturamento / clientes) : 0;
  const labels = mesesLabels?.length ? mesesLabels : ultimosMeses();
  const meses = labels.map((m, i) => ({
    m,
    v: equipe.reduce((s, p) => s + (p.spark[i] || 0), 0),
  }));
  return { ativos, faturamento, clientes, negocios, ticket, meses };
}
