# Converso — App Web

CRM para autônomos. Front-end **web** em **Next.js 15 (App Router) + TypeScript**, recriando
fielmente o design *Converso* e conectável à API existente (`../crm-api`).

> Repositório independente. Apps irmãos: `../crm-api` (NestJS) e `../converso-app` (React Native/Expo).

## Stack

- **Next.js 15** — App Router, Server/Client Components
- **TypeScript** (strict)
- **TanStack Query v5** — estado de servidor
- **Axios** — cliente HTTP com interceptors de JWT + refresh
- Sistema de design próprio em **CSS variables + inline styles** (tokens portados do design),
  fontes Sora + Plus Jakarta Sans, tema **escuro por padrão**

## Rodando

```bash
npm install
cp .env.example .env      # ajuste a URL da API se necessário
npm run dev               # http://localhost:3001 (use -p 3001 se a API ocupa a 3000)
```

Scripts: `dev`, `build`, `start`, `lint`, `typecheck`.

### Variáveis de ambiente

| Var | Default | Descrição |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | base da `crm-api` |
| `NEXT_PUBLIC_USE_MOCK` | `true` | renderiza dados mock (revisão de design sem backend) |

## Rotas

| Rota | Tela |
| --- | --- |
| `/` | Landing / visão geral (`Converso.html`) |
| `/login` | Splash → Login (seletor **Autônomo / Administrador**) |
| `/cadastro` | Criar conta |
| `/dashboard` | Home: KPIs, receita, funil-resumo, agenda do dia, negócios em destaque |
| `/servicos` | Catálogo em tabela + modal criar/editar |
| `/funil` | Funil Kanban com arrastar-e-soltar (5 etapas) |
| `/agenda` | Calendário mensal indicativo + painel do dia + novo agendamento |
| `/clientes` | Base de contatos |
| `/perfil` | Perfil, notificações, preferências, logout |
| `/empresa` | **Admin** · Visão geral da empresa |
| `/empresa/autonomos` | **Admin** · Gestão de autônomos (tabela + convite + detalhe) |
| `/empresa/desempenho` | **Admin** · Metas e ranking |
| `/empresa/config` | **Admin** · Configurações da empresa |

Alterne entre **Autônomo** e **Administrador** na tela de login ou pelo botão
"Ver como…" no rodapé da barra lateral.

## Aparência ("Tweaks")

Botão de engrenagem / "Ajustar" abre o painel lateral de **Aparência**: cor da marca,
modo claro/escuro, cantos e tipografia — ao vivo, persistido em `localStorage`.

## Arquitetura

```
src/
  app/
    layout.tsx            # html + providers (React Query + tema)
    providers.tsx         # QueryClientProvider + ThemeProvider + shell de tema
    globals.css           # tokens de design (claro + .cv-dark) + keyframes
    page.tsx              # landing (Converso.html)
    landing.module.css
    (auth)/login, /cadastro
    (app)/                # área autenticada (layout com sidebar+topbar)
      dashboard, servicos, funil, agenda, clientes, perfil,
      empresa/{., autonomos, desempenho, config}
  components/
    ui.tsx                # WButton, WCard, Avatar, Badge, Field, WModal, Logo
    charts.tsx            # WSparkline, WBarChart, WDonut
    auth/                 # BrandPanel, Splash
    app/                  # Sidebar, TopBar, AppearancePanel, AppShell, store
  lib/
    icon.tsx              # set de ícones de linha
    data.ts               # tipos do domínio + dados mock (CV)
    theme.tsx             # contexto de tema / tweaks
    api.ts                # axios + refresh de JWT
    auth-storage.ts       # tokens + papel (localStorage)
    mappers.ts            # design <-> crm-api
  services/index.ts       # camada de serviços (auth, leads, catalog, agenda, reports)
```

## Conexão com a API

As telas renderizam o **store mock** (`src/components/app/store.tsx`) para revisão de design.
A camada real está pronta em `src/services/index.ts` + `src/lib/mappers.ts`, mapeando:

| UI (design) | crm-api |
| --- | --- |
| Serviços | `catalog/products` (+ `categories`) |
| Funil / Negócios + Clientes | `leads` (+ `leads/:id/stage`) |
| Agenda | `appointments` |
| Dashboard | `reports/summary` |
| Login/Cadastro | `auth/*` (JWT + refresh) |

Para ativar a API: defina `NEXT_PUBLIC_USE_MOCK=false` e troque os mutators do store
pelas funções de `services/` (ou use-as em hooks do React Query). Veja
`../crm-api/ADAPTATIONS.md` para os ajustes de API que o layout exige.
