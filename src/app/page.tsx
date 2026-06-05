/* CONVERSO — landing / overview page. Faithful port of the design's Converso.html. */
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Icon } from '@/lib/icon';
import s from './landing.module.css';

const features: { icon: string; bg: string; color: string; title: string; desc: string }[] = [
  { icon: 'home', bg: 'var(--primary-soft)', color: 'var(--primary)', title: 'Dashboard', desc: 'Receita do mês, meta, a receber, conversão e a agenda do dia num relance.' },
  { icon: 'briefcase', bg: 'color-mix(in srgb, var(--money) 13%, transparent)', color: 'var(--money)', title: 'Serviços', desc: 'Catálogo com categorias, preço e duração. Criar e editar em formulário guiado.' },
  { icon: 'funnel', bg: 'color-mix(in srgb, var(--stage-nego) 13%, transparent)', color: 'var(--stage-nego)', title: 'Funil de vendas', desc: 'Kanban com 5 etapas — Lead a Fechado. Arraste no web, mova por toque no app.' },
  { icon: 'calendar', bg: 'color-mix(in srgb, var(--stage-contato) 13%, transparent)', color: 'var(--stage-contato)', title: 'Agenda', desc: 'Calendário indicativo com pontos por tipo de serviço e agendamento rápido.' },
  { icon: 'user', bg: 'var(--primary-soft)', color: 'var(--primary)', title: 'Conta & Perfil', desc: 'Cadastro, login (e-mail ou WhatsApp), preferências, notificações e logout.' },
  { icon: 'users', bg: 'color-mix(in srgb, var(--stage-nego) 13%, transparent)', color: 'var(--stage-nego)', title: 'Painel do administrador', desc: 'Quem gere uma empresa vê a equipe inteira: faturamento, ranking, metas e gestão de autônomos.' },
  { icon: 'settings', bg: 'var(--primary-soft)', color: 'var(--primary)', title: 'Tweaks ao vivo', desc: 'Troque cor da marca, tema claro/escuro, cantos e tipografia direto na barra.' },
];

const pills = ['Splash & Onboarding', 'Dashboard', 'Serviços', 'Funil Kanban', 'Agenda', 'Perfil'];

export default function LandingPage() {
  return (
    <div>
      <div className={s.hero}>
        <div className={s.wrap}>
          <div className={s.brand}>
            <svg className={s.mark} viewBox="0 0 32 32">
              <path d="M16 3C9 3 3.5 7.6 3.5 13.4c0 3.2 1.7 6 4.4 7.9L7 27l6-3.2c1 .2 2 .3 3 .3 7 0 12.5-4.6 12.5-10.7S23 3 16 3z" fill="#fff" />
              <path d="M11 11.5h10M11 15.5h6" stroke="#4F46E5" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            Converso
          </div>
          <div className={s.tag}>✦ Web + Mobile · conectado à sua API</div>
          <h1>O CRM completo para quem trabalha por conta própria.</h1>
          <p>Clientes, serviços, agenda e funil de vendas — do primeiro contato ao pagamento. Web em Next.js e app mobile em React Native, sobre um só sistema de design.</p>
          <div className={s.pills}>
            {pills.map((p) => (
              <span key={p} className={s.pill}>{p}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={s.wrap}>
        <div className={s.platforms}>
          {/* WEB */}
          <Link className={s.pcard} href="/login">
            <div className={`${s.preview} ${s.previewWeb}`}>
              <div className={s.win}>
                <div className={s.bar}>
                  <span className={s.dot} style={{ background: '#ff5f57' }} />
                  <span className={s.dot} style={{ background: '#febc2e' }} />
                  <span className={s.dot} style={{ background: '#28c840' }} />
                </div>
                <div className={s.winBody}>
                  <div className={s.side}>
                    <div className={s.navi} />
                    <div className={s.naviDim} />
                    <div className={s.naviDim} />
                    <div className={s.naviDim} />
                  </div>
                  <div className={s.winMain}>
                    <div className={s.kpi}>
                      <div className={s.kbox} />
                      <div className={s.kbox} />
                      <div className={s.kbox} />
                    </div>
                    <div className={s.chartMini} />
                  </div>
                </div>
              </div>
            </div>
            <div className={s.pbody}>
              <span className={s.ptype}>⬢ Frontend Web · Next.js</span>
              <h2>App Web</h2>
              <p className={s.desc}>Painel desktop com navegação lateral, tabela de serviços, funil com arrastar-e-soltar e calendário mensal.</p>
              <div className={s.feat}>
                <span className={s.chip}>Sidebar + topbar</span>
                <span className={s.chip}>Kanban drag &amp; drop</span>
                <span className={s.chip}>Tabelas</span>
                <span className={s.chip}>Painel admin</span>
                <span className={s.chip}>Calendário</span>
              </div>
              <div className={s.cta}>Entrar no App Web →</div>
            </div>
          </Link>

          {/* MOBILE */}
          <Link className={s.pcard} href="/login">
            <div className={`${s.preview} ${s.previewMob}`}>
              <div className={s.phone}>
                <div className={s.phoneTop} />
                <div className={s.pbd}>
                  <div className={s.hcard} />
                  <div className={s.row2}>
                    <div className={s.sq} />
                    <div className={s.sq} />
                  </div>
                  <div className={s.ln} />
                  <div className={s.ln} />
                </div>
              </div>
            </div>
            <div className={s.pbody}>
              <span className={s.ptype} style={{ color: 'var(--stage-contato)' }}>▸ Frontend Mobile · React Native</span>
              <h2>App Mobile</h2>
              <p className={s.desc}>Experiência nativa com splash, login, abas inferiores, ação rápida (+), funil deslizável e agenda com calendário indicativo. (Projeto Expo em <code>converso-app/</code>.)</p>
              <div className={s.feat}>
                <span className={s.chip}>Splash &amp; Login</span>
                <span className={s.chip}>Tab bar + FAB</span>
                <span className={s.chip}>Bottom sheets</span>
                <span className={s.chip}>Funil</span>
                <span className={s.chip}>Agenda</span>
              </div>
              <div className={s.cta} style={{ background: '#0EA5E9', boxShadow: '0 8px 22px color-mix(in srgb, #0EA5E9 32%, transparent)' }}>
                Ver no App Web →
              </div>
            </div>
          </Link>
        </div>

        <section className={s.feats}>
          <div className={s.shead}>
            <h2>Tudo o que o autônomo precisa</h2>
            <p>As mesmas features nas duas plataformas, sobre um design system compartilhado e conectadas à API.</p>
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

          <div className={s.note}>
            <div className={s.noteIc}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 16v-4M12 8h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
              </svg>
            </div>
            <div>
              <h3>Sobre este produto</h3>
              <p>
                Dois frontends (Next.js + React Native) prontos para a API já desenvolvida (<code>crm-api</code>). O app Web tem <b>dois níveis de acesso</b> — escolha <b>Autônomo</b> ou <b>Administrador</b> na tela de login. Use o painel de <b>Aparência</b> para explorar variações de marca, tema e tipografia ao vivo.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className={s.footer}>Converso · CRM para autônomos · 2026</footer>
    </div>
  );
}
