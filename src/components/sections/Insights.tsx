import { Link } from 'react-router-dom'
import { Fade, RevealLines } from '@/components/ui/Reveal'
import { SectionIndex } from '@/components/ui/SectionIndex'
import { articles, formatArticleDate, type Article } from '@/data/articles'

function ArticleMeta({ article }: { article: Article }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="mono-label text-cyan">{article.category}</span>
      {article.status === 'publicado' && article.date ? (
        <time dateTime={article.date} className="mono-label">
          {formatArticleDate(article.date)}
        </time>
      ) : (
        <span className="mono-label rounded-full border border-line-strong px-2 py-0.5">Em pauta</span>
      )}
    </div>
  )
}

/** Item reutilizável da lista de artigos. */
export function ArticleRow({ article, index }: { article: Article; index: number }) {
  return (
    <Link
      to={`/insights/${article.slug}`}
      className="group relative grid gap-4 border-t border-line py-9 md:grid-cols-12 md:gap-8 md:py-11"
    >
      <span className="font-mono text-xs tracking-widest text-graphite md:col-span-1">{String(index + 1).padStart(2, '0')}</span>
      <div className="md:col-span-7">
        <ArticleMeta article={article} />
        <h3 className="mt-4 font-display text-[clamp(1.5rem,2.7vw,2.5rem)] leading-[1.08] font-medium tracking-[-0.03em] transition-colors duration-500 group-hover:text-cyan">
          {article.title}
        </h3>
      </div>
      <p className="text-[0.9375rem] leading-relaxed text-graphite md:col-span-3 md:col-start-9 md:pt-8">{article.excerpt}</p>
      <span
        aria-hidden="true"
        className="absolute top-9 right-0 hidden size-10 place-items-center rounded-full border border-line-strong transition-all duration-500 group-hover:rotate-45 group-hover:border-cyan group-hover:text-cyan md:grid"
      >
        ↗
      </span>
    </Link>
  )
}

export function Insights() {
  const published = articles.filter((a) => a.status === 'publicado')
  const list = [...published, ...articles.filter((a) => a.status !== 'publicado')].slice(0, 4)

  return (
    <section id="insights" aria-labelledby="insights-title" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionIndex index="06" label="Insights" />
        <div className="mt-14 grid gap-8 md:mt-20 lg:grid-cols-12 lg:items-end">
          <RevealLines
            id="insights-title"
            className="font-display text-[clamp(2.3rem,5.6vw,6rem)] leading-[0.95] font-medium tracking-[-0.04em] lg:col-span-9"
            lines={[
              'Pensamento digital',
              <>
                <span className="text-outline">em movimento</span>
                <span className="text-cyan">.</span>
              </>,
            ]}
          />
          <Fade className="lg:col-span-3">
            <p className="text-sm leading-relaxed text-graphite">
              {published.length === 0
                ? 'Os primeiros artigos estão em produção. Abaixo, os temas que estão na pauta.'
                : 'Ideias sobre IA, automação, software e transformação digital aplicadas aos negócios.'}
            </p>
          </Fade>
        </div>

        <Fade className="mt-16 border-b border-line md:mt-24" stagger>
          {list.map((a, i) => (
            <ArticleRow key={a.slug} article={a} index={i} />
          ))}
        </Fade>
      </div>
    </section>
  )
}
