import { useLayoutEffect, useRef } from 'react'
import { Fade, RevealLines } from '@/components/ui/Reveal'
import { SectionIndex } from '@/components/ui/SectionIndex'
import { gsap } from '@/utils/gsap'
import { prefersReducedMotion, useReducedMotion } from '@/hooks/useReducedMotion'
import { cx } from '@/utils/links'

const steps = [
  { n: '01', title: 'Descoberta', text: 'Entendemos o negócio, identificamos desafios e mapeamos oportunidades.' },
  { n: '02', title: 'Estratégia', text: 'Definimos a abordagem, as tecnologias e o planejamento do projeto.' },
  { n: '03', title: 'Desenvolvimento', text: 'Construímos, testamos e implementamos a solução.' },
  { n: '04', title: 'Evolução', text: 'Acompanhamos, aprimoramos e preparamos a solução para novas necessidades.' },
]

/** Etapas em escada: cada passo desce e avança — a linha de progresso é preenchida pelo scroll. */
export function Process() {
  const listRef = useRef<HTMLOListElement>(null)
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const el = listRef.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const nodes = Array.from(el.querySelectorAll<HTMLElement>('[data-node]'))
      const horizontal =window.matchMedia('(min-width: 1024px)').matches
      gsap.fromTo(
        '[data-progress]',
        horizontal ? { scaleX: 0, scaleY: 1 } : { scaleX: 1, scaleY: 0 },
        {
          scaleX: 1,
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            end: 'bottom 60%',
            scrub: 0.5,
            // Cada nó acende quando a linha de progresso o alcança
            onUpdate: (self) =>
              nodes.forEach((n, i) => n.classList.toggle('is-on', self.progress >= i / nodes.length + 0.02 || (i === 0 && self.progress > 0.01))),
          },
        },
      )
      el.querySelectorAll<HTMLElement>('[data-step]').forEach((step) => {
        gsap.from(step.querySelectorAll('[data-step-inner]'), {
          y: 40,
          autoAlpha: 0,
          stagger: 0.06,
          scrollTrigger: { trigger: step, start: 'top 82%', once: true },
        })
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section aria-labelledby="processo-title" className="relative overflow-hidden py-28 md:py-40">
      <div className="shell">
        <SectionIndex index="04" label="Processo" />
        <RevealLines
          id="processo-title"
          className="mt-14 font-display text-[clamp(2.3rem,5.6vw,6rem)] leading-[0.95] font-medium tracking-[-0.04em] md:mt-20"
          lineClassName={(i) => (i === 1 ? 'lg:pl-[25%]' : undefined)}
          lines={[
            'Grandes soluções começam',
            <>
              com <span className="text-outline">boas perguntas</span>
              <span className="text-cyan">.</span>
            </>,
          ]}
        />

        <ol ref={listRef} className="relative mt-20 md:mt-28 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:pb-[18rem]">
          {/* Trilho de progresso — vertical no mobile, horizontal no desktop */}
          <span aria-hidden="true" className="absolute top-2 bottom-0 left-[7px] w-px bg-line lg:top-[7px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-full" />
          <span
            aria-hidden="true"
            data-progress=""
            className="absolute top-2 bottom-0 left-[7px] w-px origin-top bg-gradient-to-b from-electric to-cyan lg:top-[7px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-full lg:origin-left lg:bg-gradient-to-r"
            style={{ transform: prefersReducedMotion() ? 'none' : undefined }}
          />
          {steps.map((s, i) => (
            <li
              key={s.n}
              data-step=""
              className="relative pb-14 pl-12 last:pb-0 lg:pb-0 lg:pl-0"
              style={{ ['--drop' as string]: `${i * 6}rem` }}
            >
              <span
                aria-hidden="true"
                data-node=""
                className={cx(
                  'absolute top-0 left-0 size-[15px] rounded-full border transition-[background-color,border-color,box-shadow] duration-500',
                  'border-graphite/50 bg-navy [&.is-on]:border-electric [&.is-on]:bg-electric [&.is-on]:shadow-[0_0_0_5px_rgba(0,102,255,0.18)]',
                  reduced && 'is-on',
                )}
              />
              <div className="lg:mt-[var(--drop)] lg:pt-14">
                <span aria-hidden="true" className="absolute top-[22px] left-[7px] hidden h-[calc(var(--drop)+2.5rem)] w-px border-l border-dashed border-line-strong lg:block" />
                <p data-step-inner="" className="font-mono text-xs tracking-widest text-cyan">
                  {s.n} / 04
                </p>
                <h3 data-step-inner="" className="mt-4 font-display text-[clamp(1.75rem,2.4vw,2.5rem)] leading-tight font-medium tracking-[-0.03em]">
                  {s.title}
                </h3>
                <p data-step-inner="" className="mt-4 max-w-[19rem] leading-relaxed text-graphite">
                  {s.text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <Fade className="mt-20 flex justify-end lg:-mt-24">
          <p className="mono-label max-w-[20rem] text-right leading-relaxed">
            Um processo com entregas visíveis em cada etapa — você acompanha a construção, não só o resultado.
          </p>
        </Fade>
      </div>
    </section>
  )
}
