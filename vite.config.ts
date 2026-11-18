import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { site } from './src/config/site.ts'
import { projects } from './src/data/projects.ts'
import { articles } from './src/data/articles.ts'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/**
 * SEO a partir de src/config/site.ts:
 * - injeta Open Graph, Twitter Card, canonical e JSON-LD Organization no index.html
 * - gera robots.txt e sitemap.xml no build (sitemap só quando `site.url` estiver definido)
 */
function seoPlugin(): Plugin {
  const base = site.url.replace(/\/$/, '')
  const abs = (p: string) => (base ? `${base}${p}` : p)

  const sameAs = [site.social.instagram, site.social.linkedin].filter(Boolean)
  const organization: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    knowsAbout: [
      'Desenvolvimento de software',
      'Desenvolvimento web',
      'Automação de processos',
      'Inteligência artificial',
      'Transformação digital',
    ],
  }
  if (base) {
    organization.url = base
    organization.logo = `${base}/icon-512.png`
  }
  if (site.contact.email) organization.email = site.contact.email
  if (sameAs.length) organization.sameAs = sameAs

  const title = `${site.name} — ${site.tagline.replace(/\.$/, '')}`

  return {
    name: 'alderige-seo',
    transformIndexHtml() {
      const tags = [
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:locale', content: site.locale }],
        ['meta', { property: 'og:site_name', content: site.name }],
        ['meta', { property: 'og:title', content: title }],
        ['meta', { property: 'og:description', content: site.description }],
        ['meta', { property: 'og:image', content: abs('/og-image.png') }],
        ['meta', { property: 'og:image:width', content: '1200' }],
        ['meta', { property: 'og:image:height', content: '630' }],
        ['meta', { property: 'og:image:alt', content: 'Alderige Solutions — escultura 3D cromada e a assinatura Tecnologia que transforma negócios.' }],
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:title', content: title }],
        ['meta', { name: 'twitter:description', content: site.description }],
        ['meta', { name: 'twitter:image', content: abs('/og-image.png') }],
      ] as const
      const out: HtmlTagDescriptor[] = tags.map(([tag, attrs]) => ({ tag, attrs: { ...attrs }, injectTo: 'head' as const }))
      if (base) {
        out.push({ tag: 'link', attrs: { rel: 'canonical', href: `${base}/` }, injectTo: 'head' })
        out.push({ tag: 'meta', attrs: { property: 'og:url', content: `${base}/` }, injectTo: 'head' })
      }
      return [
        ...out,
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: JSON.stringify(organization),
          injectTo: 'head',
        },
      ]
    },
    generateBundle() {
      const robots = ['User-agent: *', 'Allow: /', base ? `Sitemap: ${base}/sitemap.xml` : ''].filter(Boolean).join('\n')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots}\n` })

      if (!base) {
        this.warn('site.url vazio em src/config/site.ts — sitemap.xml não gerado (URLs absolutas são obrigatórias).')
        return
      }
      const routes = [
        '/',
        '/privacidade',
        ...projects.map((p) => `/projetos/${p.slug}`),
        ...articles.filter((a) => a.status === 'publicado').map((a) => `/insights/${a.slug}`),
      ]
      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...routes.map((r) => `  <url><loc>${esc(base + r)}</loc></url>`),
        '</urlset>',
      ].join('\n')
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `${xml}\n` })
    },
  }
}

export default defineConfig({
  // GitHub Pages serve em /alderige-solutions/ — o workflow define BASE_PATH. Local/Vercel = raiz.
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss(), seoPlugin()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('node_modules/gsap')) return 'gsap'
        },
      },
    },
  },
})
