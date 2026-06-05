/* CONVERSO — shared mock data + domain types (ported from the design bundle).
   Scenario: a multi-service autonomous worker. Used for design review and as a
   fallback when NEXT_PUBLIC_USE_MOCK is enabled. */

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

const clientes: Cliente[] = [
  { id: 'c1', nome: 'Mariana Lopes', fone: '(11) 98842-1190', email: 'mari.lopes@gmail.com', ini: 'ML', cor: '#0EA5E9' },
  { id: 'c2', nome: 'Rafael Andrade', fone: '(11) 99710-3320', email: 'rafa.andrade@outlook.com', ini: 'RA', cor: '#8B5CF6' },
  { id: 'c3', nome: 'Studio Bloom', fone: '(11) 3045-8821', email: 'contato@studiobloom.com', ini: 'SB', cor: '#F59E0B' },
  { id: 'c4', nome: 'Camila Souza', fone: '(21) 98123-7765', email: 'camila.souza@gmail.com', ini: 'CS', cor: '#10B981' },
  { id: 'c5', nome: 'Pedro Henrique', fone: '(11) 99432-1188', email: 'ph.martins@gmail.com', ini: 'PH', cor: '#F43F5E' },
  { id: 'c6', nome: 'Ateliê Nova Casa', fone: '(11) 3322-0091', email: 'ola@novacasa.com.br', ini: 'NC', cor: '#6366F1' },
  { id: 'c7', nome: 'Beatriz Nunes', fone: '(31) 98800-4521', email: 'bia.nunes@gmail.com', ini: 'BN', cor: '#EC4899' },
];

const servicos: Servico[] = [
  { id: 's1', nome: 'Consultoria de Marca', cat: 'Consultoria', preco: 1800, dur: '3h', status: 'ativo', cliente: 'c3', desc: 'Diagnóstico de posicionamento + entrega de guia de marca.' },
  { id: 's2', nome: 'Sessão de Fotos Produto', cat: 'Fotografia', preco: 950, dur: '2h', status: 'ativo', cliente: 'c6', desc: 'Ensaio de até 15 produtos com tratamento de imagem.' },
  { id: 's3', nome: 'Manutenção Elétrica', cat: 'Reparos', preco: 320, dur: '1h30', status: 'ativo', cliente: 'c1', desc: 'Visita técnica, diagnóstico e troca de pontos.' },
  { id: 's4', nome: 'Personal Training', cat: 'Bem-estar', preco: 120, dur: '1h', status: 'ativo', cliente: 'c4', desc: 'Treino individual com plano mensal acompanhado.' },
  { id: 's5', nome: 'Design de Apresentação', cat: 'Design', preco: 680, dur: '4h', status: 'pausado', cliente: 'c2', desc: 'Deck profissional de até 20 slides.' },
  { id: 's6', nome: 'Aula de Inglês', cat: 'Educação', preco: 90, dur: '1h', status: 'ativo', cliente: 'c5', desc: 'Conversação 1:1 online, foco em negócios.' },
  { id: 's7', nome: 'Diária de Limpeza', cat: 'Reparos', preco: 180, dur: '6h', status: 'rascunho', cliente: 'c7', desc: 'Limpeza completa residencial.' },
];

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

const negocios: Negocio[] = [
  { id: 'd1', titulo: 'Rebrand completo', cliente: 'c3', valor: 4200, etapa: 'nego', dias: 2, servico: 'Consultoria de Marca' },
  { id: 'd2', titulo: 'Catálogo verão', cliente: 'c6', valor: 2850, etapa: 'prop', dias: 1, servico: 'Sessão de Fotos Produto' },
  { id: 'd3', titulo: 'Pacote treino trimestral', cliente: 'c4', valor: 1080, etapa: 'ganho', dias: 0, servico: 'Personal Training' },
  { id: 'd4', titulo: 'Reforma elétrica loja', cliente: 'c1', valor: 1600, etapa: 'contato', dias: 4, servico: 'Manutenção Elétrica' },
  { id: 'd5', titulo: 'Curso intensivo', cliente: 'c5', valor: 720, etapa: 'lead', dias: 6, servico: 'Aula de Inglês' },
  { id: 'd6', titulo: 'Deck investidores', cliente: 'c2', valor: 1360, etapa: 'prop', dias: 3, servico: 'Design de Apresentação' },
  { id: 'd7', titulo: 'Ensaio institucional', cliente: 'c7', valor: 1900, etapa: 'lead', dias: 5, servico: 'Sessão de Fotos Produto' },
  { id: 'd8', titulo: 'Mentoria de marca', cliente: 'c3', valor: 980, etapa: 'contato', dias: 2, servico: 'Consultoria de Marca' },
  { id: 'd9', titulo: 'Plano anual treino', cliente: 'c4', valor: 3200, etapa: 'nego', dias: 1, servico: 'Personal Training' },
];

const agenda: Evento[] = [
  { id: 'a1', dia: 4, hora: '09:00', dur: 90, titulo: 'Consultoria — Studio Bloom', cliente: 'c3', tipo: 'Consultoria', status: 'confirmado' },
  { id: 'a2', dia: 4, hora: '14:30', dur: 60, titulo: 'Personal — Camila', cliente: 'c4', tipo: 'Bem-estar', status: 'confirmado' },
  { id: 'a3', dia: 5, hora: '10:00', dur: 120, titulo: 'Fotos — Nova Casa', cliente: 'c6', tipo: 'Fotografia', status: 'pendente' },
  { id: 'a4', dia: 9, hora: '08:00', dur: 60, titulo: 'Aula inglês — Pedro', cliente: 'c5', tipo: 'Educação', status: 'confirmado' },
  { id: 'a5', dia: 11, hora: '15:00', dur: 90, titulo: 'Elétrica — Mariana', cliente: 'c1', tipo: 'Reparos', status: 'confirmado' },
  { id: 'a6', dia: 12, hora: '11:00', dur: 60, titulo: 'Reunião proposta — Rafael', cliente: 'c2', tipo: 'Consultoria', status: 'pendente' },
  { id: 'a7', dia: 18, hora: '09:30', dur: 120, titulo: 'Ensaio — Beatriz', cliente: 'c7', tipo: 'Fotografia', status: 'confirmado' },
  { id: 'a8', dia: 18, hora: '16:00', dur: 60, titulo: 'Personal — Camila', cliente: 'c4', tipo: 'Bem-estar', status: 'confirmado' },
  { id: 'a9', dia: 23, hora: '10:00', dur: 90, titulo: 'Consultoria — Studio Bloom', cliente: 'c3', tipo: 'Consultoria', status: 'confirmado' },
  { id: 'a10', dia: 25, hora: '14:00', dur: 60, titulo: 'Aula inglês — Pedro', cliente: 'c5', tipo: 'Educação', status: 'confirmado' },
];

const kpis = {
  receitaMes: 8740, receitaMeta: 12000, receitaDelta: 18,
  aReceber: 3260, servicosAtivos: 5,
  negociosAbertos: 6, taxaConversao: 42,
  novosClientes: 3, agendaHoje: 2,
};

const sparkReceita = [320, 0, 950, 540, 120, 1800, 410];
const receitaMeses = [
  { m: 'Jan', v: 6200 }, { m: 'Fev', v: 7100 }, { m: 'Mar', v: 5800 },
  { m: 'Abr', v: 9300 }, { m: 'Mai', v: 8100 }, { m: 'Jun', v: 8740 },
];

const equipe: Membro[] = [
  { id: 'p1', nome: 'Júlia Mendes', area: 'Design & Consultoria', ini: 'JM', cor: '#4F46E5', status: 'ativo', receita: 8740, clientes: 7, negocios: 9, conversao: 42, servicos: 7, desde: '2024', spark: [6200, 7100, 5800, 9300, 8100, 8740] },
  { id: 'p2', nome: 'Marcos Vinícius', area: 'Fotografia', ini: 'MV', cor: '#0EA5E9', status: 'ativo', receita: 11200, clientes: 12, negocios: 6, conversao: 51, servicos: 4, desde: '2023', spark: [7400, 8900, 9500, 10200, 9800, 11200] },
  { id: 'p3', nome: 'Ana Beatriz', area: 'Bem-estar', ini: 'AB', cor: '#10B981', status: 'ativo', receita: 6480, clientes: 18, negocios: 4, conversao: 38, servicos: 3, desde: '2025', spark: [3200, 4100, 4800, 5600, 6100, 6480] },
  { id: 'p4', nome: 'Carlos Eduardo', area: 'Reparos', ini: 'CE', cor: '#F59E0B', status: 'ativo', receita: 5320, clientes: 9, negocios: 5, conversao: 33, servicos: 5, desde: '2024', spark: [4800, 5100, 4600, 5900, 5000, 5320] },
  { id: 'p5', nome: 'Fernanda Lima', area: 'Educação', ini: 'FL', cor: '#EC4899', status: 'pendente', receita: 2940, clientes: 14, negocios: 3, conversao: 29, servicos: 2, desde: '2026', spark: [0, 0, 1200, 1800, 2400, 2940] },
  { id: 'p6', nome: 'Rodrigo Alves', area: 'Consultoria', ini: 'RA', cor: '#8B5CF6', status: 'inativo', receita: 0, clientes: 5, negocios: 0, conversao: 0, servicos: 1, desde: '2023', spark: [4200, 3100, 2000, 900, 0, 0] },
];

const empresa = { nome: 'Studio Coletivo', admin: 'Helena Castro', adminIni: 'HC', plano: 'Empresa', metaEquipe: 45000 };

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

export const clienteById = (id: string): Cliente =>
  clientes.find((c) => c.id === id) || { id, nome: '—', ini: '?', cor: '#999', fone: '', email: '' };

export const CV = {
  clientes,
  servicos,
  catColor,
  etapas,
  negocios,
  agenda,
  kpis,
  equipe,
  empresa,
  STATUS_TEAM,
  STATUS_META,
  sparkReceita,
  receitaMeses,
  clienteById,
  fmtBRL,
  catIcon,
  user: {
    nome: 'Júlia Mendes',
    papel: 'Designer & Consultora',
    email: 'julia.mendes@converso.app',
    ini: 'JM',
    cidade: 'São Paulo, SP',
    plano: 'Profissional',
  },
  meses: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  diasSemana: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
};
