import { ContactForm } from '@/components/contact/ContactForm'
import { Fade, RevealLines } from '@/components/ui/Reveal'
import { SectionIndex } from '@/components/ui/SectionIndex'
import { site } from '@/config/site'
import { emailLink, socialLinks, whatsappLink } from '@/utils/links'

export function Contact() {
  const wa = whatsappLink()
  const mail = emailLink('Contato pelo site')
  const socials = socialLinks()
  const channels = [
    wa && { label: 'WhatsApp', value: 'Conversar agora', href: wa, external: true },
    mail && { label: 'E-mail', value: site.contact.email, href: mail, external: false },
    ...socials.map((s) => ({ label: s.label, value: 'Acompanhar', href: s.href, external: true })),
  ].filter(Boolean) as { label: string; value: string; href: string; external: boolean }[]

  return (
    <section id="contato" aria-labelledby="contato-title" className="relative bg-midnight py-28 md:py-40">
      <div className="shell">
        <SectionIndex index="08" label="Contato" />
        <div className="mt-14 grid gap-16 md:mt-20 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <RevealLines
              id="contato-title"
              className="font-display text-[clamp(2.3rem,4.4vw,4.5rem)] leading-[0.98] font-medium tracking-[-0.04em]"
              lines={[
                'Conte o',
                <span className="text-outline">desafio.</span>,
                <>
                  A gente desenha a solução<span className="text-cyan">.</span>
                </>,
              ]}
            />
            <Fade>
              <p className="mt-8 max-w-[24rem] leading-relaxed text-graphite">
                Descreva o contexto com suas palavras — não precisa saber qual tecnologia usar. Essa parte é com a gente.
              </p>
            </Fade>

            {channels.length > 0 && (
              <Fade as="ul" stagger className="mt-12 border-t border-line">
                {channels.map((c) => (
                  <li key={c.label} className="border-b border-line">
                    <a
                      href={c.href}
                      {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="group flex items-center justify-between py-4"
                    >
                      <span className="mono-label">{c.label}</span>
                      <span className="text-sm text-offwhite transition-colors group-hover:text-cyan">{c.value} ↗</span>
                    </a>
                  </li>
                ))}
              </Fade>
            )}
          </div>

          <Fade className="lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </Fade>
        </div>
      </div>
    </section>
  )
}
