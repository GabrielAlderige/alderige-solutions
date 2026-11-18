import { Link, useLocation } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { site } from '@/config/site'
import { navItems } from '@/data/navigation'
import { services } from '@/data/services'
import { emailLink, socialLinks, whatsappLink } from '@/utils/links'
import { sectionHref } from '@/components/navigation/Header'

export function Footer() {
  const onHome = useLocation().pathname === '/'
  const wa = whatsappLink()
  const mail = emailLink()
  const socials = socialLinks()
  const year = new Date().getFullYear()

  const linkCls = 'text-sm text-graphite transition-colors hover:text-offwhite'

  return (
    <footer className="relative z-10 overflow-hidden border-t border-line bg-midnight">
      <div className="shell pt-20 pb-10 md:pt-28">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-6 max-w-[22rem] text-sm leading-relaxed text-graphite">
              Empresa de tecnologia especializada em soluções digitais, sistemas, automações empresariais e aplicações de
              inteligência artificial.
            </p>
            <p className="mono-label mt-6 text-offwhite">{site.tagline}</p>
          </div>

          <nav aria-label="Rodapé — navegação" className="md:col-span-2 md:col-start-6">
            <p className="mono-label mb-5">Navegação</p>
            <ul className="space-y-3">
              {navItems.map((n) => (
                <li key={n.id}>
                  <a href={sectionHref(n.id, onHome)} className={linkCls}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <p className="mono-label mb-5">Soluções</p>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.id}>
                  <a href={sectionHref('solucoes', onHome)} className={linkCls}>
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="mono-label mb-5">Contato</p>
            <ul className="space-y-3">
              {mail && (
                <li>
                  <a href={mail} className={linkCls}>
                    {site.contact.email}
                  </a>
                </li>
              )}
              {wa && (
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className={linkCls}>
                    WhatsApp
                  </a>
                </li>
              )}
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={sectionHref('contato', onHome)} className={linkCls}>
                  Formulário de contato
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Assinatura monumental */}
        <p
          aria-hidden="true"
          className="mt-24 font-display text-[clamp(4rem,19.5vw,22rem)] leading-[0.78] font-semibold tracking-[-0.06em] text-transparent select-none [-webkit-text-stroke:1px_rgba(137,147,164,0.32)]"
        >
          ALDERIGE
        </p>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 text-xs text-graphite md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legal.companyName}
            {site.legal.document && ` · CNPJ ${site.legal.document}`}. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link to="/privacidade" className="hover:text-offwhite">
              Política de privacidade
            </Link>
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-offwhite">
              Voltar ao topo ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
