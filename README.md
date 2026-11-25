# Uptime Monitor — Frontend

Dashboard em Next.js para o [backend](https://github.com/SEU_USUARIO/uptime-monitor-backend): cadastro de projetos/monitores, histórico de checagens com gráfico de latência, incidentes e página pública de status.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS
- Recharts

## Rodando localmente

```bash
cp .env.local.example .env.local   # aponte BACKEND_URL para o backend
npm install
npm run dev
```

## Páginas

- `/` — landing
- `/login`, `/register` — autenticação
- `/dashboard` — projetos do usuário
- `/dashboard/projects/[id]` — monitores do projeto
- `/dashboard/monitors/[id]` — gráfico de latência + incidentes
- `/status/[slug]` — página pública de status (sem autenticação)

## Segurança

- **Sem token em `localStorage`**: a sessão vive inteiramente em cookie `httpOnly` setado pelo backend; o frontend nunca lê ou guarda o JWT (mitiga roubo via XSS)
- **Proxy reverso pro backend** (`next.config.ts` → `rewrites()`): o navegador só fala com o próprio domínio do frontend, que repassa `/api/*` pro backend nos bastidores. Sem isso, o cookie de sessão seria "de terceiros" (frontend e backend em domínios diferentes) e navegadores modernos bloqueiam esse tipo de cookie por padrão
- **CSRF**: todo request de mutação (POST/PUT/PATCH/DELETE) envia o header `X-CSRF-Token` lido do cookie não-httpOnly `csrf_token`, exigido pelo backend (ver `src/lib/api.ts`)
- **Headers de segurança** (`next.config.ts`): `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`
- **Validação client-side espelha as regras do backend** (ex: senha mínima de 12 caracteres, slug restrito a `[a-z0-9-]`), mas a validação real acontece no servidor — o frontend nunca é a única linha de defesa
- **CI**: lint + type-check + build + `npm audit --audit-level=high` em todo PR; Dependabot semanal
