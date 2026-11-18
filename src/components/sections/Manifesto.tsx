import { Fade, RevealLines, ScrubWords } from '@/components/ui/Reveal'
import { SectionIndex } from '@/components/ui/SectionIndex'

const pillars = [
  {
    n: '01',
    title: 'Estratégia',
    text: 'Entendemos o problema antes de escolher a tecnologia.',
    glyph: (
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="32" cy="32" r="22" />
        <circle cx="32" cy="32" r="12" strokeDasharray="2 3" />
        <path d="M32 4v56M4 32h56" opacity="0.4" />
        <circle cx="44" cy="20" r="2.5" fill="currentColor" />
      </g>
    ),
  },
  {
    n: '02',
    title: 'Tecnologia',
    text: 'Desenvolvemos soluções eficientes, modernas e integradas.',
    glyph: (
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="10" y="10" width="20" height="20" />
        <rect x="34" y="10" width="20" height="20" opacity="0.5" />
        <rect x="10" y="34" width="20" height="20" opacity="0.5" />
        <rect x="34" y="34" width="20" height="20" />
        <path d="M30 20h4M20 30v4M44 30v4M30 44h4" />
      </g>
    ),
  },
  {
    n: '03',
    title: 'Evolução',
    text: 'Criamos estruturas preparadas para acompanhar o crescimento dos negócios.',
    glyph: (
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M6 54 L22 40 L34 46 L58 12" />
        <path d="M48 12h10v10" />
        <path d="M6 58h52" opacity="0.4" />
        <circle cx="22" cy="40" r="2" fill="currentColor" />
        <circle cx="34" cy="46" r="2" fill="currentColor" />
      </g>
    ),
  },
]

export function Manifesto() {
  return (
    <section id="sobre" aria-labelledby="sobre-title" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionIndex index="01" label="Manifesto" />

        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12">
          <RevealLines
            id="sobre-title"
            className="font-display text-[clamp(2.3rem,6.4vw,7rem)] leading-[0.95] font-medium tracking-[-0.04em] lg:col-span-11"
            lineClassName={(i) => (i >= 2 ? 'lg:pl-[16.66%]' : undefined)}
            lines={[
              <span className="text-outline">Não desenvolvemos</span>,
              <span className="text-outline">apenas tecnologia.</span>,
              'Construímos',
              <>
                possibilidades<span className="text-cyan">.</span>
              </>,
            ]}
          />
        </div>

        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12">
          <Fade className="lg:col-span-3">
            <p className="mono-label max-w-[16rem] leading-relaxed">
              Cada projeto começa com uma pergunta:
            </p>
            <p className="mt-3 max-w-[18rem] font-display text-xl leading-snug text-offwhite">
              como podemos fazer isso funcionar melhor?
            </p>
          </Fade>

          <div className="space-y-8 lg:col-span-8 lg:col-start-5">
            <ScrubWords
              className="font-display text-[clamp(1.35rem,2.5vw,2.25rem)] leading-[1.25] font-light tracking-tight text-offwhite"
              text="A tecnologia evolui constantemente. Os negócios também precisam evoluir. Na Alderige, transformamos necessidades reais em soluções digitais inteligentes, combinando estratégia, desenvolvimento e inovação."
            />
          </div>
        </div>

        <ol className="mt-24 border-t border-line md:mt-32 lg:grid lg:grid-cols-3 lg:border-t-0">
          {pillars.map((p, i) => (
            <Fade
              as="li"
              key={p.n}
              delay={i * 0.08}
              className="group relative border-b border-line py-10 lg:border-t lg:border-b-0 lg:px-8 lg:py-12 lg:first:pl-0 lg:[&:not(:first-child)]:border-l"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs tracking-widest text-cyan">{p.n}.</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 64 64"
                  className="size-14 text-graphite transition-[color,transform] duration-700 ease-[var(--ease-expo)] group-hover:rotate-[8deg] group-hover:text-cyan"
                >
                  {p.glyph}
                </svg>
              </div>
              <h3 className="mt-10 font-display text-3xl font-medium tracking-tight md:text-4xl">{p.title}</h3>
              <p className="mt-4 max-w-[22rem] leading-relaxed text-graphite">{p.text}</p>
              <span
                aria-hidden="true"
                className="absolute bottom-0 left-0 h-px w-0 bg-cyan transition-[width] duration-700 ease-[var(--ease-expo)] group-hover:w-full lg:top-0 lg:bottom-auto"
              />
            </Fade>
          ))}
        </ol>
      </div>
    </section>
  )
}
