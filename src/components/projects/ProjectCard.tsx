import { Link } from 'react-router-dom'
import { projectKindLabel, type Project } from '@/data/projects'
import { cx } from '@/utils/links'
import { ProjectVisual } from './ProjectVisual'

export function KindBadge({ project }: { project: Project }) {
  const concept = project.kind === 'conceito'
  return (
    <span
      className={cx(
        'inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.14em] uppercase',
        concept ? 'border-cyan/40 text-cyan' : 'border-line-strong text-offwhite',
      )}
    >
      <span aria-hidden="true" className={cx('size-1.5 rounded-full', concept ? 'border border-cyan' : 'bg-electric')} />
      {projectKindLabel[project.kind]}
    </span>
  )
}

/**
 * Card reutilizável de projeto.
 * `feature` = destaque grande; `row` = linha editorial compacta.
 */
export function ProjectCard({ project, variant = 'row' }: { project: Project; variant?: 'feature' | 'row' }) {
  if (variant === 'feature') {
    return (
      <Link
        to={`/projetos/${project.slug}`}
        className="group grid gap-8 rounded-sm lg:grid-cols-12 lg:gap-x-8"
        aria-label={`${project.name} — ver projeto`}
      >
        <ProjectVisual
          project={project}
          className="aspect-[16/10] transition-[transform] duration-1000 ease-[var(--ease-expo)] lg:col-span-7 [&>div]:transition-transform [&>div]:duration-1000 group-hover:[&>div]:scale-[1.035]"
        />
        <div className="flex flex-col lg:col-span-5 lg:pt-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs tracking-widest text-cyan">{project.index}</span>
            <KindBadge project={project} />
          </div>
          <h3 className="mt-6 font-display text-[clamp(2rem,3.6vw,3.5rem)] leading-[1] font-medium tracking-[-0.035em]">
            {project.name}
          </h3>
          <p className="mono-label mt-4">{project.category}</p>
          <p className="mt-6 max-w-[30rem] leading-relaxed text-graphite">{project.summary}</p>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.6875rem] tracking-wider text-graphite/80" aria-label="Tecnologias">
            {project.technologies.map((t) => (
              <li key={t}>/{t}</li>
            ))}
          </ul>
          <span className="mt-auto inline-flex items-center gap-3 pt-10 font-display text-sm text-offwhite">
            Ver estudo
            <span aria-hidden="true" className="h-px w-10 bg-offwhite transition-[width] duration-700 ease-[var(--ease-expo)] group-hover:w-20" />
          </span>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/projetos/${project.slug}`}
      className="group relative grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-4 border-t border-line py-8 md:grid-cols-12 md:gap-x-8"
      aria-label={`${project.name} — ver projeto`}
    >
      <span className="font-mono text-xs tracking-widest text-cyan md:col-span-1">{project.index}</span>
      <div className="md:col-span-5">
        <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.4rem)] leading-tight font-medium tracking-[-0.03em] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-2">
          {project.name}
        </h3>
      </div>
      <p className="col-span-2 text-sm text-graphite md:col-span-3">{project.category}</p>
      <div className="col-span-2 flex items-center justify-between gap-4 md:col-span-3">
        <KindBadge project={project} />
        <ProjectVisual
          project={project}
          className="hidden h-16 w-28 shrink-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100 md:block"
        />
      </div>
    </Link>
  )
}
