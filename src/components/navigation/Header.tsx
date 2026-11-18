import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navItems } from '@/data/navigation'
import { Logo } from '@/components/ui/Logo'
import { MobileMenu } from './MobileMenu'
import { cx } from '@/utils/links'

export const sectionHref = (id: string, onHome: boolean) => (onHome ? `#${id}` : `/#${id}`)

export function Header() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('inicio')
  const lastY = useRef(0)

  // Aparência discreta no topo; fundo sutil ao rolar; recolhe ao descer, volta ao subir
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      setHidden(y > 480 && y > lastY.current + 4)
      if (y < lastY.current - 4 || y < 480) setHidden(false)
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Seção ativa (somente na home)
  useEffect(() => {
    if (!onHome) return
    const els = navItems.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [onHome, pathname])

  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-[80] rounded-full bg-offwhite px-4 py-2 text-midnight focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Pular para o conteúdo
      </a>
      <header
        className={cx(
          'fixed inset-x-0 top-0 transition-[transform,background-color,border-color] duration-700 ease-[var(--ease-expo)]',
          open ? 'z-[65]' : 'z-50',
          scrolled && !open ?'border-b border-line bg-midnight/72 backdrop-blur-md' : 'border-b border-transparent',
          hidden && !open ? '-translate-y-full' : 'translate-y-0',
        )}
      >
        <div className="shell flex h-18 items-center justify-between gap-6 md:h-20">
          <Link to="/" aria-label="Alderige Solutions — início" className="relative z-[70] shrink-0 rounded-sm">
            <Logo />
          </Link>

          <nav aria-label="Navegação principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.slice(0, -1).map((item) => {
                const isActive = onHome && active === item.id
                return (
                  <li key={item.id}>
                    <a
                      href={sectionHref(item.id, onHome)}
                      aria-current={isActive ? 'true' : undefined}
                      className={cx(
                        'group relative flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.8125rem] transition-colors duration-300',
                        isActive ? 'text-offwhite' : 'text-graphite hover:text-offwhite',
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cx(
                          'size-1 rounded-full bg-cyan transition-all duration-500',
                          isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                        )}
                      />
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={sectionHref('contato', onHome)}
              className="group hidden items-center gap-2.5 rounded-full border border-line-strong py-2 pr-2 pl-4 text-[0.8125rem] text-offwhite transition-colors duration-500 hover:border-cyan/70 hover:bg-offwhite hover:text-midnight sm:inline-flex"
            >
              Vamos conversar
              <span aria-hidden="true" className="grid size-6 place-items-center rounded-full bg-electric text-offwhite">
                <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 9 9 3M4 3h5v5" />
                </svg>
              </span>
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              className="relative z-[70] grid size-11 place-items-center rounded-full border border-line-strong lg:hidden"
            >
              <span aria-hidden="true" className="relative block h-2.5 w-4.5">
                <span
                  className={cx(
                    'absolute left-0 h-px w-full bg-offwhite transition-transform duration-500 ease-[var(--ease-expo)]',
                    open ? 'top-1/2 rotate-45' : 'top-0',
                  )}
                />
                <span
                  className={cx(
                    'absolute left-0 h-px w-full bg-offwhite transition-transform duration-500 ease-[var(--ease-expo)]',
                    open ? 'top-1/2 -rotate-45' : 'top-full',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} onHome={onHome} />
    </>
  )
}
