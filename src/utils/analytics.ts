import { site } from '@/config/site'

/**
 * Camada única de analytics. Sem IDs fictícios: enquanto
 * `site.analytics.provider` for 'none', nada é carregado nem enviado.
 */

type Props = Record<string, string | number | boolean>

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Props }) => void
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export function initAnalytics() {
  const { provider, id } = site.analytics
  if (provider === 'none' || !id) return

  if (provider === 'plausible') {
    const s = document.createElement('script')
    s.defer = true
    s.dataset.domain = id
    s.src = 'https://plausible.io/js/script.js'
    document.head.appendChild(s)
  }

  if (provider === 'ga4') {
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
    document.head.appendChild(s)
    window.dataLayer = window.dataLayer || []
    window.gtag = (...args: unknown[]) => window.dataLayer!.push(args)
    window.gtag('js', new Date())
    window.gtag('config', id, { anonymize_ip: true })
  }
}

export function track(event: string, props?: Props) {
  if (site.analytics.provider === 'plausible') window.plausible?.(event, { props })
  if (site.analytics.provider === 'ga4') window.gtag?.('event', event, props)
}

export function trackPageview(path: string) {
  if (site.analytics.provider === 'ga4') window.gtag?.('event', 'page_view', { page_path: path })
  // Plausible registra pageviews de SPA automaticamente
}
