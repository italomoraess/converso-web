/* CONVERSO — domain types + UI constants (cores de etapa/categoria, status,
   formatação). Os dados são carregados da crm-api (ver src/services + store);
   este arquivo não contém mais dados de exemplo. */

export type StageId = 'lead' | 'contato' | 'prop' | 'nego' | 'ganho';
export type ServiceStatus = 'ativo' | 'pausado' | 'rascunho';
export type TeamStatus = 'ativo' | 'pendente' | 'inativo';
export type ApptStatus = 'confirmado' | 'pendente';

export interface Cliente {
  id: string;
  nome: string;
  fone: string;
  email: string;
  ini: string;
  cor: string;
}

export interface Servico {
  id: string;
  nome: string;
  cat: string;
  preco: number;
  dur: string;
  status: ServiceStatus;
  cliente: string;
  desc: string;
}

export interface Etapa {
  id: StageId;
  nome: string;
  cor: string;
}

export interface Negocio {
  id: string;
  titulo: string;
  cliente: string;
  valor: number;
  etapa: StageId;
  dias: number;
  servico: string;
}

export interface Evento {
  id: string;
  dia: number;
  hora: string;
  dur: number;
  titulo: string;
  cliente: string;
  tipo: string;
  status: ApptStatus;
}

export interface Membro {
  id: string;
  nome: string;
  area: string;
  ini: string;
  cor: string;
  status: TeamStatus;
  receita: number;
  clientes: number;
  negocios: number;
  conversao: number;
  servicos: number;
  desde: string;
  spark: number[];
}

export const catColor: Record<string, string> = {
  Consultoria: '#4F46E5', Fotografia: '#0EA5E9', Reparos: '#F59E0B',
  'Bem-estar': '#10B981', Design: '#8B5CF6', Educação: '#EC4899',
};

const etapas: Etapa[] = [
  { id: 'lead', nome: 'Lead', cor: 'var(--stage-lead)' },
  { id: 'contato', nome: 'Contato', cor: 'var(--stage-contato)' },
  { id: 'prop', nome: 'Proposta', cor: 'var(--stage-prop)' },
  { id: 'nego', nome: 'Negociação', cor: 'var(--stage-nego)' },
  { id: 'ganho', nome: 'Fechado', cor: 'var(--stage-ganho)' },
];

export const STATUS_TEAM: Record<TeamStatus, { label: string; cor: string }> = {
  ativo: { label: 'Ativo', cor: 'var(--money)' },
  pendente: { label: 'Pendente', cor: 'var(--warn)' },
  inativo: { label: 'Inativo', cor: 'var(--text-subtle)' },
};

export const STATUS_META: Record<ServiceStatus, { label: string; cor: string }> = {
  ativo: { label: 'Ativo', cor: 'var(--money)' },
  pausado: { label: 'Pausado', cor: 'var(--warn)' },
  rascunho: { label: 'Rascunho', cor: 'var(--text-subtle)' },
};

const catIconMap: Record<string, string> = {
  Consultoria: 'sparkle', Fotografia: 'camera', Reparos: 'settings',
  'Bem-estar': 'target', Design: 'grid', Educação: 'star',
};
export const catIcon = (cat: string): string => catIconMap[cat] || 'tag';

export const fmtBRL = (n: number): string => 'R$ ' + n.toLocaleString('pt-BR');

const MESES_CURTOS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

/** Rótulos dos últimos `n` meses (até o mês corrente) — usado como fallback de
 *  labels quando a API ainda não retornou a série. */
export const ultimosMeses = (n = 6): string[] => {
  const cur = new Date().getMonth();
  return Array.from({ length: n }, (_, i) => MESES_CURTOS[(cur - (n - 1 - i) + 12) % 12]);
};

/** Constantes de UI compartilhadas pelas telas. */
export const CV = {
  catColor,
  etapas,
  STATUS_TEAM,
  STATUS_META,
  catIcon,
  fmtBRL,
  meses: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  diasSemana: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
};
