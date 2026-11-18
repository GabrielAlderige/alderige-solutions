# Alderige Solutions — website institucional

React 19 + TypeScript + Vite + Tailwind CSS v4 + Three.js + GSAP/ScrollTrigger.

```bash
npm install
npm run dev        # http://localhost:5199
npm run build      # typecheck + build em dist/
npm run preview    # serve o build
npm run check      # testes automatizados (Playwright + Chrome) — rode com o dev server ligado
```

## Antes de publicar — `src/config/site.ts`

Nada de contato, link ou ID é inventado. Campos vazios simplesmente não aparecem no site.

| Campo | Para quê |
|---|---|
| `url` | Domínio definitivo (`https://...`, sem barra final). Ativa canonical, `og:url`, URLs absolutas no Open Graph e gera o `sitemap.xml` no build. |
| `contact.email` | Exibido no rodapé, menu, contato e política de privacidade. Sem `form.endpoint`, o formulário abre o app de e-mail com a mensagem pronta. |
| `contact.whatsapp` | Só dígitos com DDI+DDD (`55119...`). Ativa botões de WhatsApp (CTA final, contato, menu, rodapé). |
| `social.instagram` / `social.linkedin` | URLs completas. |
| `form.endpoint` | Endpoint que recebe `POST` JSON. Veja abaixo. |
| `analytics.provider` / `id` | `'plausible'` (id = domínio) ou `'ga4'` (id = `G-XXXX`). Com `'none'` nada é carregado. |
| `legal.document` / `privacyUpdatedAt` | CNPJ e data da política, quando houver. |
| `logo.src` | SVG oficial (coloque em `public/brand/`). Substitui o logotipo tipográfico provisório automaticamente. |

### Formulário de contato

Sem `form.endpoint`, o formulário **não finge enviar**: ele avisa o usuário (ou usa `mailto:` se houver e-mail).

O envio é `POST` com `Content-Type: application/json`:

```json
{ "nome": "", "empresa": "", "email": "", "whatsapp": "", "solucao": "", "mensagem": "", "origem": "site", "pagina": "https://..." }
```

Serviços compatíveis: Formspree (`https://formspree.io/f/<id>`), Getform, Basin, **webhook do n8n** (recomendado — já permite
enviar para CRM, e-mail e WhatsApp), ou uma API própria. Qualquer resposta 2xx conta como sucesso.

Proteções já inclusas: validação no cliente, honeypot anti-spam, consentimento LGPD com link para `/privacidade`, timeout de 15 s.

## Conteúdo

- **Serviços** — `src/data/services.ts`
- **Projetos** — `src/data/projects.ts`. Cada item vira card na home e página em `/projetos/<slug>`.
  `kind: 'conceito'` exibe o selo "Conceito interno" e o aviso de que não é projeto de cliente.
  Imagens em `public/projects/<slug>/` (campo `images`); sem imagens, usa um visual gerado.
  `results` só com números medidos.
- **Insights** — `src/data/articles.ts`. `status: 'em-pauta'` aparece sem data e com `noindex`.
  Para publicar: `status: 'publicado'`, `date`, `body` (blocos `p`, `h2`, `quote`, `list`) e `cover` opcional.

## Estrutura

```
src/
  config/site.ts            dados centrais (contato, SEO, integrações)
  data/                     serviços, projetos, artigos, navegação
  components/
    3d/                     escultura WebGL (sculpture.ts), camada React, fallback SVG, store
    sections/               seções da home
    projects/ contact/      componentes reutilizáveis de projeto e formulário
    navigation/ layout/ ui/
  hooks/                    coreografia do 3D no scroll, meta tags, reduced motion
  pages/                    Home, Projeto, Artigo, Privacidade, 404
  styles/index.css          tokens da marca (Tailwind @theme) e utilitários
scripts/
  check-site.mjs            verificação automatizada + screenshots
  generate-assets.mjs       gera og-image.png e ícones PNG
```

## 3D

- Escultura procedural (fita cromada contínua + anel de vidro + órbitas + módulos): nenhum modelo ou HDRI é baixado.
- three.js é carregado sob demanda depois do primeiro paint (chunk separado); até lá aparece um fallback SVG.
- Sem WebGL ou com perda de contexto → fallback SVG permanente.
- `prefers-reduced-motion` → quadros estáticos, sem loop contínuo; animações CSS/GSAP desligadas.
- Mobile/aparelhos modestos → menos geometria, DPR limitado, sem antialias.
- O render pausa sozinho quando a escultura está invisível (seções intermediárias) e quando a aba fica oculta.

A posição/escala/opacidade por seção fica em `src/hooks/useSceneChoreography.ts`.

## SEO

`index.html` recebe no build (via plugin em `vite.config.ts`): Open Graph, Twitter Card, JSON-LD `Organization`
e, com `site.url` definido, canonical e `sitemap.xml`. `robots.txt` é sempre gerado. Cada página atualiza
título/descrição/canonical via `useDocumentMeta`.

Como é uma SPA, se SEO de páginas internas virar prioridade, o próximo passo é pré-renderizar as rotas
(ex.: `vite-react-ssg`) — a estrutura de dados já está pronta para isso.

## Deploy

Arquivos de fallback de SPA já incluídos: `vercel.json` (Vercel) e `public/_redirects` (Netlify/Cloudflare Pages).
Comando de build: `npm run build` · pasta de saída: `dist`.

## Marca provisória

O logotipo tipográfico (ALDERIGE / SOLUTIONS) e o favicon "A" são **provisórios**. Ao receber os SVGs oficiais:
1. Coloque em `public/brand/` e preencha `site.logo.src`.
2. Substitua `public/favicon.svg` e rode `node scripts/generate-assets.mjs` com o dev server ligado para regerar ícones e `og-image.png`.
