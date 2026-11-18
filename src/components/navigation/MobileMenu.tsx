import { useEffect, useRef } from 'react'
import { navItems } from '@/data/navigation'
import { site } from '@/config/site'
import { cx, emailLink, socialLinks, whatsappLink } from '@/utils/links'
import { sectionHref } from './Header'

interface Props {
  open: boolean
  onClose: () => void
  onHome: boolean
}

/** Menu mobile em tela cheia: tipografia grande, entrada escalonada, Esc fecha, foco preso no painel. */
export function MobileMenu({ open, onClose, onHome }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const first = panelRef.current?.querySelector<HTMLElement>('a')
    first?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a, button')
        const list = Array.from(f)
        const idx = list.indexOf(document.activeElement as HTMLElement)
        if (e.shiftKey && idx <= 0) {
          e.preventDefault()
          list[list.length - 1]?.focus()
        } else if (!e.shiftKey && idx === list.length - 1) {
          e.preventDefault()
          list[0]?.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  const wa = whatsappLink()
  const mail = emailLink()
  const socials = socialLinks()

  return (
    <div
      id="menu-mobile"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      inert={!open}
      className={cx(
        'fixed inset-0 z-[60] flex flex-col bg-midnight/96 backdrop-blur-xl transition-[clip-path] duration-700 ease-[var(--ease-expo)] lg:hidden',
        open ? '[clip-path:inset(0_0_0_0)]' : '[clip-path:inset(0_0_100%_0)]',
      )}
    >
      <div className="pointer-events-none absolute -top-1/4 -right-1/3 size-[90vw] rounded-full bg-electric/15 blur-[90px]" />
      <nav aria-label="Navegação mobile" className="shell relative flex flex-1 flex-col justify-center pt-20">
        <ul className="space-y-1">
          {navItems.map((item, i) => (
            <li key={item.id} className="overflow-hidden">
              <a
                href={sectionHref(item.id, onHome)}
                onClick={onClose}
                className={cx(
                  'flex items-baseline gap-4 py-1.5 font-display text-[clamp(2.4rem,11vw,4rem)] leading-[1.05] font-medium tracking-tight transition-transform duration-700 ease-[var(--ease-expo)]',
                  open ? 'translate-y-0' : 'translate-y-full',
                )}
                style={{ transitionDelay: open ? `${120 + i * 55}ms` : '0ms' }}
              >
                <span className="font-mono text-xs tracking-widest text-cyan">0{i + 1}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="shell relative flex flex-wrap items-end justify-between gap-4 border-t border-line py-6">
        <p className="mono-label">{site.tagline}</p>
        <div className="flex flex-wrap gap-4 text-sm text-graphite">
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-offwhite">
              WhatsApp
            </a>
          )}
          {mail && (
            <a href={mail} className="hover:text-offwhite">
              E-mail
            </a>
          )}
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-offwhite">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
