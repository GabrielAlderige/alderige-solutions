import { useEffect, useRef } from 'react'
import { ButtonLink } from '@/components/ui/Button'
import { Fade, RevealLines } from '@/components/ui/Reveal'
import { services } from '@/data/services'
import { site } from '@/config/site'
import { isFinePointer } from '@/utils/device'

const Cross = ({ className }: { className: string }) => (
  <svg aria-hidden="true" viewBox="0 0 11 11" className={`absolute size-2.5 text-graphite/60 ${className}`}>
    <path d="M5.5 0v11M0 5.5h11" stroke="currentColor" strokeWidth="1" />
  </svg>
)

/** Leitura técnica que acompanha o cursor — conecta a interface ao objeto 3D. */
function PointerReadout() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!isFinePointer()) return
    const onMove = (e: PointerEvent) => {
      if (!ref.current) return
      const x = ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3)
      const y = (-((e.clientY / window.innerHeight) * 2 - 1)).toFixed(3)
      ref.current.textContent = `${x.padStart(6, ' ')} / ${y.padStart(6, ' ')}`
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return (
    <span ref={ref} className="tabular-nums">
      0.000 / 0.000
    </span>
  )
}

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Vinheta para legibilidade sobre o 3D */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(8,11,18,0.85)_100%)]" />

      <div className="shell relative flex flex-1 flex-col pt-24 pb-8 md:pt-28 lg:pb-10">
        {/* Linha técnica superior */}
        <Fade immediate delay={0.9} className="hidden items-start justify-between md:flex">
          <div className="mono-label flex gap-10">
            <span>
              <span className="text-cyan">(00)</span>&nbsp;&nbsp;Software · Automação · IA
            </span>
          </div>
          <div className="mono-label text-right">
            <span className="block">Fig. 01 — Estrutura em transformação</span>
            <span className="mt-1 block text-graphite/70">
              cursor&nbsp;&nbsp;<PointerReadout />
            </span>
          </div>
        </Fade>

        <div className="mt-auto pt-[38svh] md:pt-0">
          <RevealLines
            as="h1"
            id="hero-title"
            immediate
            delay={0.15}
            className="font-display text-[clamp(2.65rem,11.4vw,11rem)] leading-[0.9] font-medium tracking-[-0.045em] md:text-[clamp(3rem,min(8.2vw,14.5vh),11rem)]"
            lineClassName={(i) => ['', 'md:pl-[9vw]', '', 'md:pl-[17vw]'][i]}
            lines={[
              'O futuro',
              <span className="text-outline">dos negócios</span>,
              'é construído',
              <>
                com <span className="text-gradient-electric">tecnologia</span>
                <span className="text-cyan">.</span>
              </>,
            ]}
          />

          <div className="mt-10 grid gap-10 md:mt-[min(3.5rem,5vh)] md:grid-cols-12 md:items-end">
            <Fade immediate delay={0.75} className="md:col-span-6 lg:col-span-5">
              <p className="max-w-[34rem] text-[1.0625rem] leading-relaxed text-graphite md:text-lg">
                <span className="text-offwhite">Desenvolvemos soluções digitais inteligentes</span> que conectam ideias,
                tecnologia e resultados.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ButtonLink href="#solucoes">Conheça nossas soluções</ButtonLink>
                <ButtonLink href="#contato" variant="ghost">
                  Vamos conversar
                </ButtonLink>
              </div>
            </Fade>

            <Fade immediate delay={1} className="hidden md:col-span-4 md:col-start-9 md:block">
              <p className="mono-label mb-4 text-offwhite">{site.tagline}</p>
              <ul className="border-t border-line">
                {services.map((s) => (
                  <li key={s.id} className="border-b border-line">
                    <a
                      href="#solucoes"
                      className="group flex items-center justify-between py-2.5 text-sm text-graphite transition-colors hover:text-offwhite"
                    >
                      <span className="flex items-center gap-4">
                        <span className="font-mono text-[0.6875rem] text-cyan/80">{s.index}</span>
                        {s.short}
                      </span>
                      <span aria-hidden="true" className="translate-x-[-6px] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Fade>
          </div>
        </div>

        {/* Indicador de scroll */}
        <Fade immediate delay={1.2} className="mt-10 flex items-center justify-between md:mt-[min(2.5rem,4vh)]">
          <a href="#sobre" className="group flex items-center gap-4" aria-label="Rolar para a próxima seção">
            <span className="relative block h-10 w-px overflow-hidden bg-line">
              <span className="scroll-cue absolute inset-0 bg-cyan" />
            </span>
            <span className="mono-label transition-colors group-hover:text-offwhite">Role para explorar</span>
          </a>
          <span className="mono-label hidden md:block">Comp. 01 — 61.8 / 38.2</span>
        </Fade>
      </div>

      <Cross className="top-24 left-[clamp(1rem,4vw,3.5rem)] hidden md:block" />
      <Cross className="right-[clamp(1rem,4vw,3.5rem)] bottom-28 hidden md:block" />
    </section>
  )
}
