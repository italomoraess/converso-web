/* CONVERSO — landing page de vendas do CRM. CTA de assinatura → Stripe Checkout. */
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Icon } from '@/lib/icon';
import { CheckoutButton } from '@/components/landing/CheckoutButton';
import s from './landing.module.css';

/* Preço apenas para exibição — a fonte da verdade é o STRIPE_PRICE_ID na crm-api.
   Ajuste este rótulo para casar com o preço configurado no Stripe. */
const PRICE_LABEL = 'R$ 39';

const features: { icon: string; bg: string; color: string; title: string; desc: string }[] = [
  { icon: 'funnel', bg: 'color-mix(in srgb, var(--stage-nego) 13%, transparent)', color: 'var(--stage-nego)', title: 'Funil de vendas visual', desc: 'Acompanhe cada oportunidade do Lead ao Fechado num Kanban de 5 etapas. Nada cai no esquecimento.' },
  { icon: 'calendar', bg: 'color-mix(in srgb, var(--stage-contato) 13%, transparent)', color: 'var(--stage-contato)', title: 'Agenda inteligente', desc: 'Calendário do mês com seus compromissos por tipo de serviço e agendamento em segundos.' },
  { icon: 'briefcase', bg: 'color-mix(in srgb, var(--money) 13%, transparent)', color: 'var(--money)', title: 'Catálogo de serviços', desc: 'Preço, duração e status de cada serviço organizados — pronto para vender mais rápido.' },
  { icon: 'users', bg: 'var(--primary-soft)', color: 'var(--primary)', title: 'Clientes em um só lugar', desc: 'Histórico, contato e valor de cada cliente sempre à mão, no navegador ou no celular.' },
  { icon: 'home', bg: 'var(--primary-soft)', color: 'var(--primary)', title: 'Dashboard de resultados', desc: 'Receita do mês, meta, a receber e conversão num relance, com gráficos que fazem sentido.' },
  { icon: 'lock', bg: 'color-mix(in srgb, var(--stage-nego) 13%, transparent)', color: 'var(--stage-nego)', title: 'Painel para equipes', desc: 'Gerencia vários autônomos? Veja faturamento da equipe, ranking, metas e aprove cadastros.' },
];

const steps = [
  { n: '1', title: 'Crie sua conta grátis', desc: 'Leva menos de um minuto, sem cartão de crédito. Você ganha 3 dias para testar tudo.' },
  { n: '2', title: 'Cadastre serviços e clientes', desc: 'Monte seu catálogo e importe seus contatos. O funil já começa a trabalhar por você.' },
  { n: '3', title: 'Acompanhe e receba', desc: 'Mova oportunidades no funil, confirme a agenda e feche negócios — do contato ao pagamento.' },
];

const planFeatures = [
  'Funil, agenda, serviços e clientes ilimitados',
  'Dashboard com receita, meta e conversão',
  'App web + mobile sincronizados',
  'Painel de equipe (multi-autônomo)',
  'Suporte por WhatsApp',
];

export default function LandingPage() {
  return (
    <div>
      {/* HERO */}
      <div className={s.hero}>
        <div className={s.wrap}>
          <nav className={s.nav}>
            <div className={s.brand}>
              <svg className={s.mark} viewBox="0 0 32 32">
                <path d="M16 3C9 3 3.5 7.6 3.5 13.4c0 3.2 1.7 6 4.4 7.9L7 27l6-3.2c1 .2 2 .3 3 .3 7 0 12.5-4.6 12.5-10.7S23 3 16 3z" fill="#fff" />
                <path d="M11 11.5h10M11 15.5h6" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              Converso
            </div>
            <div className={s.navLinks}>
              <Link className={s.navLink} href="#planos">Planos</Link>
              <Link className={s.navLink} href="/login">Entrar</Link>
            </div>
          </nav>

          <div className={s.tag}>✦ Para autônomos e pequenas equipes</div>
          <h1>O CRM que organiza seus clientes, agenda e vendas — num só lugar.</h1>
          <p>Do primeiro contato ao pagamento. Funil visual, agenda com confirmação, catálogo de serviços e relatórios — no navegador e no celular, sempre sincronizados.</p>

          <div className={s.heroCtas}>
            <Link className={s.btnPrimary} href="/cadastro">Começar grátis <Icon name="arrowR" size={18} /></Link>
            <Link className={s.btnGhost} href="#planos">Ver planos</Link>
          </div>
          <div className={s.micro}>3 dias grátis · sem cartão de crédito</div>

          <div className={s.pills}>
            {['Funil Kanban', 'Agenda do mês', 'Serviços', 'Clientes', 'Dashboard', 'Pix & cartão'].map((p) => (
              <span key={p} className={s.pill}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={s.wrap}>
        {/* FEATURES */}
        <section className={s.feats}>
          <div className={s.shead}>
            <h2>Tudo o que o autônomo precisa para vender mais</h2>
            <p>Organize a rotina, não perca oportunidades e tenha controle do seu faturamento — sem planilhas.</p>
          </div>
          <div className={s.grid}>
            {features.map((f) => (
              <div key={f.title} className={s.fcard}>
                <div className={s.ficon} style={{ background: f.bg, color: f.color } as CSSProperties}>
                  <Icon name={f.icon} size={22} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className={s.feats} style={{ paddingTop: 0 }}>
          <div className={s.shead}>
            <h2>Comece em 3 passos</h2>
            <p>Sem instalação, sem configuração complicada. Você cria a conta e já começa a usar.</p>
          </div>
          <div className={s.steps}>
            {steps.map((st) => (
              <div key={st.n} className={s.step}>
                <div className={s.stepNum}>{st.n}</div>
                <h3>{st.title}</h3>
                <p>{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section id="planos" className={s.pricing}>
          <div className={s.shead}>
            <h2>Um plano simples, sem surpresas</h2>
            <p>Tudo incluso. Cancele quando quiser.</p>
          </div>
          <div className={s.planWrap}>
            <div className={s.plan}>
              <span className={s.planTag}><Icon name="sparkle" size={14} /> Plano Pro</span>
              <div className={s.planName}>Converso Pro</div>
              <div className={s.planPrice}>
                <b>{PRICE_LABEL}</b>
                <span>/ mês</span>
              </div>
              <ul className={s.planList}>
                {planFeatures.map((f) => (
                  <li key={f}>
                    <span className={s.planCheck}><Icon name="check" size={13} stroke={3} /></span>
                    {f}
                  </li>
                ))}
              </ul>
              <CheckoutButton className={s.planCta}>
                Assinar agora <Icon name="arrowR" size={18} />
              </CheckoutButton>
              <Link className={s.planAlt} href="/cadastro">ou comece com 3 dias grátis</Link>
              <div className={s.planSecure}>
                <Icon name="lock" size={13} /> Pagamento seguro via Stripe
              </div>
            </div>
          </div>
        </section>

        {/* CTA BAND */}
        <section className={s.ctaBand}>
          <h2>Pronto para organizar seu negócio?</h2>
          <p>Junte-se aos autônomos que fecham mais negócios com o Converso. Comece grátis hoje.</p>
          <div className={s.heroCtas}>
            <Link className={s.btnPrimary} href="/cadastro">Criar conta grátis <Icon name="arrowR" size={18} /></Link>
            <CheckoutButton className={s.btnGhost}>Assinar o Pro</CheckoutButton>
          </div>
        </section>
      </div>

      <footer className={s.footer}>Converso · CRM para autônomos · © 2026</footer>
    </div>
  );
}
