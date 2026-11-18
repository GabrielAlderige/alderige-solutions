import { ButtonLink } from '@/components/ui/Button'
import { Fade, RevealLines } from '@/components/ui/Reveal'
import { whatsappLink } from '@/utils/links'

/** Fecho da narrativa: a escultura do hero volta ao centro, atrás da headline. */
export function FinalCTA() {
  const wa = whatsappLink()
  return (
    <section id="cta-final" aria-labelledby="cta-title" className="relative flex min-h-[100svh] items-center overflow-hidden py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_62%,rgba(8,11,18,0.7),transparent_100%)]" />
      <div className="shell relative text-center">
        <Fade>
          <p className="mono-label">
            <span className="text-cyan">(07)</span>&nbsp;&nbsp;Próximo passo
          </p>
        </Fade>
        <RevealLines
          id="cta-title"
          className="mx-auto mt-10 font-display text-[clamp(2.6rem,9vw,10rem)] leading-[0.9] font-medium tracking-[-0.05em]"
          lines={[
            'Seu próximo',
            <span className="text-outline">avanço começa</span>,
            <>
              com uma conversa<span className="text-cyan">.</span>
            </>,
          ]}
        />
        <Fade delay={0.2}>
          <p className="mx-auto mt-10 max-w-[34rem] text-[1.0625rem] leading-relaxed text-graphite md:text-lg">
            Tem um desafio, uma ideia ou um processo que poderia funcionar melhor?{' '}
            <span className="text-offwhite">Vamos construir a solução.</span>
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="#contato">Vamos conversar</ButtonLink>
            {wa && (
              <ButtonLink href={wa} variant="ghost" target="_blank" rel="noopener noreferrer">
                Falar no WhatsApp
              </ButtonLink>
            )}
          </div>
        </Fade>
      </div>
    </section>
  )
}
