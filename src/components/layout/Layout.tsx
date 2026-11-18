import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/components/navigation/Header'
import { Footer } from './Footer'
import { ScrollTrigger } from '@/utils/gsap'
import { trackPageview } from '@/utils/analytics'

export function Layout() {
  const { pathname, hash } = useLocation()

  // Navegação entre páginas: topo ou âncora; recalcula gatilhos de scroll
  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      const tryScroll = (attempt = 0) => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView()
        else if (attempt < 10) window.setTimeout(() => tryScroll(attempt + 1), 60)
      }
      requestAnimationFrame(() => tryScroll())
    } else {
      window.scrollTo(0, 0)
    }
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 120)
    trackPageview(pathname)
    return () => window.clearTimeout(t)
  }, [pathname, hash])

  return (
    <>
      <div className="grid-lines" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className={i >= 4 ? 'hidden lg:block' : undefined} />
        ))}
      </div>
      <Header />
      <main id="conteudo" tabIndex={-1} className="relative z-10 outline-none">
        <Outlet />
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
