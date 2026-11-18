import { Fade, RevealLines } from '@/components/ui/Reveal'
import { SectionIndex } from '@/components/ui/SectionIndex'

const items = [
  { title: 'Soluções personalizadas', text: 'Cada solução nasce do contexto da empresa, não de um pacote fechado.' },
  { title: 'Tecnologia moderna', text: 'Stacks atuais, mantidas pela comunidade e escolhidas pelo problema — não pela moda.' },
  { title: 'Integração entre ferramentas', text: 'Conectamos o que a empresa já usa em vez de substituir tudo.' },
  { title: 'Foco em problemas reais', text: 'Começamos pelo gargalo que custa tempo e dinheiro hoje.' },
  { title: 'Arquitetura preparada para evoluir', text: 'Código organizado e documentado para crescer sem recomeçar do zero.' },
  { title: 'Comunicação transparente', text: 'Escopo, prazos e decisões técnicas explicados com clareza, sem jargão desnecessário.' },
]

export function Differentials() {
  return (
    <section aria-labelledby="diferenciais-title" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionIndex index="05" label="Diferenciais" />
        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12">
          <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
            <RevealLines
              id="diferenciais-title"
              className="font-display text-[clamp(2.3rem,4.8vw,5rem)] leading-[0.98] font-medium tracking-[-0.04em]"
              lines={[
                'Pensamento',
                <span className="text-outline">estratégico.</span>,
                'Execução',
                <>
                  tecnológica<span className="text-cyan">.</span>
                </>,
              ]}
            />
            <Fade>
              <p className="mt-8 max-w-[24rem] leading-relaxed text-graphite">
                O que guia cada decisão — do primeiro diagnóstico à última linha de código.
              </p>
            </Fade>
          </div>

          <ul className="grid border-t border-l border-line sm:grid-cols-2 lg:col-span-7">
            {items.map((item, i) => (
              <Fade
                as="li"
                key={item.title}
                delay={(i % 2) * 0.06}
                className="corner-marks group relative border-r border-b border-line p-7 transition-colors duration-500 hover:bg-navy/60 md:p-9"
              >
                <span className="font-mono text-[0.6875rem] tracking-widest text-graphite transition-colors group-hover:text-cyan">
                  /{String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-10 font-display text-[1.45rem] leading-tight font-medium tracking-tight md:mt-14 md:text-[1.6rem]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-graphite">{item.text}</p>
              </Fade>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
