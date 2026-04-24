import Link from "next/link";
import {
  Zap,
  Check,
  Crown,
  Users,
  KanbanSquare,
  CalendarDays,
  BarChart3,
  ShoppingBag,
  DollarSign,
  MessageCircle,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Leads ilimitados",
    desc: "Cadastre e organize todos os seus contatos em um só lugar, sem limites.",
  },
  {
    icon: KanbanSquare,
    title: "Funil Kanban",
    desc: "Visualize cada etapa do seu processo de vendas com arrasta e solta.",
  },
  {
    icon: CalendarDays,
    title: "Agenda e tarefas",
    desc: "Nunca perca um follow-up. Gerencie compromissos com lembretes integrados.",
  },
  {
    icon: DollarSign,
    title: "Controle financeiro",
    desc: "Registre entradas, saídas e veja o fluxo de caixa em tempo real.",
  },
  {
    icon: ShoppingBag,
    title: "Catálogo de produtos",
    desc: "Crie seu catálogo com categorias, preços e anexe aos pedidos.",
  },
  {
    icon: BarChart3,
    title: "Relatórios e analytics",
    desc: "Acompanhe taxa de conversão, ticket médio e performance do funil.",
  },
];

const faqs = [
  {
    q: "Existe período de teste gratuito?",
    a: "Não cobramos nada nos primeiros 3 dias — cancele antes e não paga nada.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim, sem multa e sem burocracia. Basta cancelar pelo painel a qualquer momento.",
  },
  {
    q: "O pagamento é seguro?",
    a: "Sim. O pagamento é processado pelo Stripe, plataforma usada por milhões de empresas no mundo.",
  },
  {
    q: "Quantos usuários posso ter?",
    a: "O plano atual é para um usuário por conta. Planos para equipe em breve.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-md shadow-blue-500/20">
              <Zap size={16} color="#fff" />
            </div>
            <span className="font-bold text-lg">Converso</span>
          </div>
          <Link
            href="/login"
            className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
          >
            Já sou cliente →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <Zap size={14} />
          CRM para pequenos negócios
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--foreground)] leading-tight mb-6">
          Feche mais vendas.<br />
          <span className="text-[var(--primary)]">Sem planilha.</span>
        </h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10">
          O Converso é um CRM simples e poderoso para autônomos e pequenas empresas gerenciarem leads, agenda, financeiro e catálogo — tudo num só lugar.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 h-14 px-8 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold rounded-xl transition-colors text-lg shadow-lg shadow-blue-500/25"
          >
            <Crown size={20} />
            Começar agora — R$ 49/mês
          </Link>
          <a
            href="#recursos"
            className="h-14 px-8 border border-[var(--border)] text-[var(--foreground)] font-medium rounded-xl hover:bg-[var(--muted)] transition-colors text-base flex items-center"
          >
            Ver recursos
          </a>
        </div>
        <p className="mt-4 text-sm text-[var(--text-secondary)]">
          3 dias grátis · cancele quando quiser
        </p>
      </section>

      {/* Social proof bar */}
      <div className="border-y border-[var(--border)] bg-[var(--muted)]/50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <Check size={14} className="text-[var(--success)]" />
            <span>Sem contrato de fidelidade</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={14} className="text-[var(--success)]" />
            <span>Pagamento 100% seguro via Stripe</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={14} className="text-[var(--success)]" />
            <span>Suporte via WhatsApp</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle size={14} className="text-[var(--whatsapp)]" />
            <span>WhatsApp direto do CRM</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <section id="recursos" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
            Tudo que você precisa para vender mais
          </h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
            Uma plataforma completa pensada para quem vende, não para quem programa.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-3 hover:border-[var(--primary)]/40 hover:shadow-md transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                <f.icon size={20} className="text-[var(--primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--foreground)]">{f.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="preco" className="bg-[var(--muted)]/40 border-y border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
              Um plano simples. Sem surpresas.
            </h2>
            <p className="text-[var(--text-secondary)] text-lg">
              Preço fixo, sem letra miúda, sem cobranças extras.
            </p>
          </div>

          <div className="max-w-sm mx-auto">
            <div className="bg-[var(--card)] border-2 border-[var(--primary)] rounded-2xl p-8 shadow-xl shadow-blue-500/10 space-y-6 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-[var(--primary)] text-white text-xs font-bold px-4 py-1 rounded-full">
                  MAIS POPULAR
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
                  <Crown size={20} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[var(--foreground)]">Plano Pro</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Acesso completo</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-[var(--foreground)]">R$ 49</span>
                  <span className="text-[var(--text-secondary)] mb-1">/mês</span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">3 dias grátis para testar</p>
              </div>

              <ul className="space-y-3">
                {[
                  "Leads ilimitados",
                  "Funil de vendas Kanban",
                  "Agenda e gestão de tarefas",
                  "Catálogo de produtos",
                  "Controle financeiro",
                  "Relatórios e analytics",
                  "WhatsApp integrado",
                  "Suporte via WhatsApp",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[var(--success)] flex items-center justify-center shrink-0">
                      <Check size={12} color="#fff" />
                    </div>
                    <span className="text-sm text-[var(--foreground)]">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className="flex items-center justify-center gap-2 w-full h-12 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-semibold rounded-xl transition-colors"
              >
                <Crown size={16} />
                Assinar agora
              </Link>

              <p className="text-center text-xs text-[var(--text-secondary)]">
                Cancele quando quiser. Sem multa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">Perguntas frequentes</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer font-medium text-[var(--foreground)] list-none select-none hover:bg-[var(--muted)] transition-colors">
                {faq.q}
                <ChevronDown
                  size={16}
                  className="text-[var(--text-secondary)] shrink-0 transition-transform group-open:rotate-180"
                />
              </summary>
              <div className="px-6 pb-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-[var(--primary)] py-16">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">
            Pronto para organizar suas vendas?
          </h2>
          <p className="text-white/80 text-lg">
            Comece grátis por 3 dias e descubra como o Converso pode transformar sua rotina de vendas.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 h-14 px-10 bg-white text-[var(--primary)] font-bold rounded-xl hover:bg-white/90 transition-colors text-lg"
          >
            <Crown size={20} />
            Começar agora — R$ 49/mês
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--background)]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[var(--primary)] flex items-center justify-center">
              <Zap size={12} color="#fff" />
            </div>
            <span className="font-semibold text-[var(--foreground)]">Converso</span>
            <span>· CRM para pequenos negócios</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-[var(--foreground)] transition-colors">
              Entrar
            </Link>
            <Link href="/register" className="hover:text-[var(--foreground)] transition-colors">
              Criar conta
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
