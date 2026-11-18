import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getProject, projects } from '@/data/projects'
import { KindBadge } from '@/components/projects/ProjectCard'
import { ProjectVisual } from '@/components/projects/ProjectVisual'
import { ButtonLink } from '@/components/ui/Button'
import { Fade, RevealLines } from '@/components/ui/Reveal'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import NotFound from './NotFound'

export default function ProjectPage() {
  const { slug = '' } = useParams()
  const project = getProject(slug)
  useDocumentMeta({
    title: project?.name,
    description: project?.summary,
    path: `/projetos/${slug}`,
    noindex: !project,
  })
  if (!project) return <NotFound />

  const i = projects.indexOf(project)
  const next = projects[(i + 1) % projects.length]
  const concept = project.kind === 'conceito'

  return (
    <article className="pt-32 pb-24 md:pt-40">
      <div className="shell">
        <Link to="/#projetos" className="mono-label inline-flex items-center gap-2 hover:text-offwhite">
          <ArrowLeft className="size-3.5" aria-hidden="true" /> Projetos
        </Link>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <span className="font-mono text-xs tracking-widest text-cyan">{project.index}</span>
          <KindBadge project={project} />
          <span className="mono-label">{project.category}</span>
          {project.year && <span className="mono-label">{project.year}</span>}
        </div>

        <RevealLines
          as="h1"
          immediate
          className="mt-8 max-w-[16ch] font-display text-[clamp(2.6rem,7vw,7.5rem)] leading-[0.94] font-medium tracking-[-0.045em]"
          lines={[project.name]}
        />
        <Fade immediate delay={0.3}>
          <p className="mt-8 max-w-[40rem] text-lg leading-relaxed text-graphite">{project.summary}</p>
        </Fade>

        {concept && (
          <Fade immediate delay={0.4}>
            <p className="mt-8 max-w-[40rem] border-l border-cyan/50 pl-5 text-sm leading-relaxed text-graphite">
              Este é um <span className="text-cyan">conceito interno</span>: um estudo da Alderige para explorar uma
              solução. Não se trata de um projeto entregue a cliente e não apresenta resultados comerciais.
            </p>
          </Fade>
        )}

        <Fade immediate delay={0.45} className="mt-16">
          <ProjectVisual project={project} className="aspect-[16/9] w-full" eager />
        </Fade>

        <div className="mt-20 grid gap-16 md:mt-28 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <p className="mono-label mb-4">Tecnologias</p>
            <ul className="space-y-2 border-t border-line pt-4">
              {project.technologies.map((t) => (
                <li key={t} className="font-mono text-sm text-offwhite/90">
                  /{t}
                </li>
              ))}
            </ul>
            {project.demoUrl && (
              <div className="mt-8">
                <ButtonLink href={project.demoUrl} variant="ghost" target="_blank" rel="noopener noreferrer">
                  Ver demonstração
                </ButtonLink>
              </div>
            )}
          </aside>

          <div className="space-y-16 lg:col-span-8 lg:col-start-5">
            <Fade as="section" aria-labelledby="p-problema">
              <h2 id="p-problema" className="mono-label text-cyan">
                {concept ? 'Problema explorado' : 'Problema identificado'}
              </h2>
              <p className="mt-5 font-display text-[clamp(1.4rem,2.4vw,2.1rem)] leading-[1.3] font-light tracking-tight">
                {project.problem}
              </p>
            </Fade>
            <Fade as="section" aria-labelledby="p-solucao">
              <h2 id="p-solucao" className="mono-label text-cyan">
                {concept ? 'Solução proposta' : 'Solução desenvolvida'}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-offwhite/90">{project.solution}</p>
            </Fade>
            {project.results.length > 0 && (
              <Fade as="section" aria-labelledby="p-resultados">
                <h2 id="p-resultados" className="mono-label text-cyan">
                  Resultados medidos
                </h2>
                <dl className="mt-6 grid gap-px bg-line sm:grid-cols-2">
                  {project.results.map((r) => (
                    <div key={r.label} className="bg-midnight p-6">
                      <dt className="text-sm text-graphite">{r.label}</dt>
                      <dd className="mt-2 font-display text-4xl font-medium tracking-tight">{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </Fade>
            )}
            {project.images.length > 1 && (
              <div className="grid gap-6 sm:grid-cols-2">
                {project.images.slice(1).map((img) => (
                  <img key={img.src} src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" decoding="async" className="w-full ring-1 ring-line" />
                ))}
              </div>
            )}
          </div>
        </div>

        {next && next.slug !== project.slug && (
          <Link
            to={`/projetos/${next.slug}`}
            className="group mt-28 flex flex-col gap-4 border-t border-line pt-10 md:flex-row md:items-end md:justify-between"
          >
            <span className="mono-label">Próximo projeto</span>
            <span className="font-display text-[clamp(1.8rem,4vw,3.75rem)] leading-none font-medium tracking-[-0.04em] transition-colors group-hover:text-cyan">
              {next.name} →
            </span>
          </Link>
        )}
      </div>
    </article>
  )
}
