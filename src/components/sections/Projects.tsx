import { Fade, RevealLines } from '@/components/ui/Reveal'
import { SectionIndex } from '@/components/ui/SectionIndex'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { projects } from '@/data/projects'

export function Projects() {
  const [featured, ...rest] = projects
  const hasConcepts = projects.some((p) => p.kind === 'conceito')

  return (
    <section id="projetos" aria-labelledby="projetos-title" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionIndex index="03" label="Projetos" />
        <div className="mt-14 grid gap-8 md:mt-20 lg:grid-cols-12 lg:items-end">
          <RevealLines
            id="projetos-title"
            className="font-display text-[clamp(2.6rem,8vw,8.5rem)] leading-[0.92] font-medium tracking-[-0.045em] lg:col-span-8"
            lines={[
              <>
                Da <span className="text-outline">ideia</span>
              </>,
              <span className="lg:pl-[12vw]">
                à solução<span className="text-cyan">.</span>
              </span>,
            ]}
          />
          {hasConcepts && (
            <Fade className="lg:col-span-4">
              <p className="border-l border-cyan/50 pl-5 text-sm leading-relaxed text-graphite">
                Itens marcados como <span className="text-cyan">Conceito interno</span> são estudos e experimentos da
                própria Alderige — não representam projetos de clientes nem resultados comerciais.
              </p>
            </Fade>
          )}
        </div>

        {featured && (
          <Fade className="mt-20 md:mt-28">
            <ProjectCard project={featured} variant="feature" />
          </Fade>
        )}

        {rest.length > 0 && (
          <Fade className="mt-20 border-b border-line md:mt-28" stagger>
            {rest.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </Fade>
        )}
      </div>
    </section>
  )
}
