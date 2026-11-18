import { useEffect } from 'react'
import { site } from '@/config/site'

interface Meta {
  title?: string
  description?: string
  /** Caminho da página (ex.: '/privacidade') para canonical/og:url. */
  path?: string
  noindex?: boolean
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** Título, descrição, canonical e Open Graph por página (SPA). */
export function useDocumentMeta({ title, description, path = '/', noindex }: Meta) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${site.name}` : `${site.name} — ${site.tagline.replace(/\.$/, '')}`
    const desc = description ?? site.description
    document.title = fullTitle
    setMeta('meta[name="description"]', 'name', 'description', desc)
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc)
    setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex, follow' : 'index, follow')

    if (site.url) {
      const href = `${site.url.replace(/\/$/, '')}${path}`
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.appendChild(link)
      }
      link.href = href
      setMeta('meta[property="og:url"]', 'property', 'og:url', href)
    }
  }, [title, description, path, noindex])
}
