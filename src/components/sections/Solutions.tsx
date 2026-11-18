import { Fade, RevealLines } from '@/components/ui/Reveal'
import { SectionIndex } from '@/components/ui/SectionIndex'
import { services, type Service } from '@/data/services'
import { useOffscreenPause } from '@/hooks/useOffscreenPause'
import { cx } from '@/utils/links'
import { ServiceVisual } from './ServiceVisual'

/** Cada serviço tem composição própria: alterna lado, proporção e alinhamento. */
const layouts = [
  { visual: 'lg:col-span-5 lg:col-start-1', content: 'lg:col-span-6 lg:col-start-7', order: '' },
  { visual: 'lg:col-span-6 lg:col-start-7 lg:row-start-1', content: 'lg:col-span-5 lg:col-start-1 lg:row-start-1', order: '' },
  { visual: 'lg:col-span-4 lg:col-start-2', content: 'lg:col-span-6 lg:col-start-7', order: '' },
  { visual: 'lg:col-span-5 lg:col-start-8 lg:row-start-1', content: 'lg:col-span-6 lg:col-start-1 lg:row-start-1', order: '' },
]

function ServiceBlock({ service, i }: { service: Service; i: number }) {
  const ref = useOffscreenPause<HTMLElement>()
  const l = layouts[i % layouts.length]
  return (
    <article
      ref={ref}
      aria-labelledby={`svc-${service.id}`}
      className="group relative grid gap-10 border-t border-line py-16 md:py-24 lg:grid-cols-12 lg:items-center lg:gap-x-8"
    >
      <Fade className={cx('relative', l.visual)}>
        <div className="corner-marks relative aspect-[4/3] overflow-hidden bg-navy/40 ring-1 ring-line transition-[background-color] duration-700 group-hover:bg-navy/70">
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_40%,rgba(0,102,255,0.14),transparent_70%)] opacity-60 transition-opacity duration-700 group-hover:opacity-100" />
          <div className="absolute inset-[6%] transition-transform duration-1000 ease-[var(--ease-expo)] group-hover:scale-[1.04]">
            <ServiceVisual kind={service.visual} />
          </div>
          <span className="mono-label absolute top-4 left-4">{service.tag}</span>
          <span className="mono-label absolute right-4 bottom-4">fig. {service.index}</span>
        </div>
      </Fade>

      <div className={cx('relative', l.content)}>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 right-0 font-display text-[clamp(6rem,14vw,13rem)] leading-none font-medium tracking-[-0.06em] text-transparent transition-[color] duration-700 [-webkit-text-stroke:1px_rgba(137,147,164,0.28)] group-hover:[-webkit-text-stroke-color:rgba(0,217,255,0.55)] md:-top-16"
        >
          {service.index}
        </span>
        <Fade>
          <p className="font-mono text-xs tracking-widest text-cyan">{service.index} —</p>
          <h3
            id={`svc-${service.id}`}
            className="mt-5 max-w-[14ch] font-display text-[clamp(2.1rem,4.4vw,4.25rem)] leading-[0.98] font-medium tracking-[-0.035em]"
          >
            {service.title}
          </h3>
          <p className="mt-6 max-w-[36rem] text-[1.0625rem] leading-relaxed text-graphite">{service.description}</p>
        </Fade>
        <Fade as="ul" stagger className="mt-10 grid max-w-[38rem] gap-x-8 sm:grid-cols-2">
          {service.capabilities.map((c) => (
            <li key={c} className="flex items-baseline gap-3 border-b border-line py-3 text-[0.9375rem] text-offwhite/90">
              <span aria-hidden="true" className="font-mono text-[0.6875rem] text-electric">
                +
              </span>
              {c}
            </li>
          ))}
        </Fade>
      </div>
    </article>
  )
}

export function Solutions() {
  return (
    <section id="solucoes" aria-labelledby="solucoes-title" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionIndex index="02" label="Soluções" />
        <div className="mt-14 grid gap-8 md:mt-20 lg:grid-cols-12 lg:items-end">
          <RevealLines
            id="solucoes-title"
            className="font-display text-[clamp(2.4rem,6.2vw,6.75rem)] leading-[0.95] font-medium tracking-[-0.04em] lg:col-span-8"
            lines={[
              'Tecnologia aplicada',
              <>
                a <span className="text-outline">desafios reais</span>
                <span className="text-cyan">.</span>
              </>,
            ]}
          />
          <Fade className="lg:col-span-3 lg:col-start-10">
            <p className="leading-relaxed text-graphite">
              Quatro frentes que se combinam conforme o problema. Começamos pelo que precisa funcionar melhor — a
              tecnologia vem depois.
            </p>
          </Fade>
        </div>

        <div className="mt-20 md:mt-28">
          {services.map((s, i) => (
            <ServiceBlock key={s.id} service={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
