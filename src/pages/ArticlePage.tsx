import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { articles, formatArticleDate, getArticle, type ArticleBlock } from '@/data/articles'
import { ButtonLink } from '@/components/ui/Button'
import { Fade, RevealLines } from '@/components/ui/Reveal'
import { ArticleRow } from '@/components/sections/Insights'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import NotFound from './NotFound'

function Block({ b }: { b: ArticleBlock }) {
  switch (b.type) {
    case 'h2':
      return <h2 className="mt-14 font-display text-3xl font-medium tracking-tight">{b.text}</h2>
    case 'quote':
      return (
        <blockquote className="my-12 border-l-2 border-cyan pl-6 font-display text-2xl leading-snug font-light">{b.text}</blockquote>
      )
    case 'list':
      return (
        <ul className="mt-6 list-disc space-y-2 pl-5 text-lg leading-relaxed text-offwhite/90 marker:text-cyan">
          {b.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      )
    default:
      return <p className="mt-6 text-lg leading-[1.8] text-offwhite/90">{b.text}</p>
  }
}

export default function ArticlePage() {
  const { slug = '' } = useParams()
  const article = getArticle(slug)
  const draft = article?.status !== 'publicado'
  useDocumentMeta({
    title: article?.title,
    description: article?.excerpt,
    path: `/insights/${slug}`,
    // Pautas não publicadas não devem ser indexadas
    noindex: !article || draft,
  })
  if (!article) return <NotFound />

  const others = articles.filter((a) => a.slug !== article.slug).slice(0, 3)

  return (
    <article className="pt-32 pb-24 md:pt-40">
      <div className="shell">
        <Link to="/#insights" className="mono-label inline-flex items-center gap-2 hover:text-offwhite">
          <ArrowLeft className="size-3.5" aria-hidden="true" /> Insights
        </Link>

        <div className="mx-auto mt-12 max-w-[52rem]">
          <div className="flex flex-wrap items-center gap-4">
            <span className="mono-label text-cyan">{article.category}</span>
            {!draft && article.date ? (
              <time dateTime={article.date} className="mono-label">
                {formatArticleDate(article.date)}
              </time>
            ) : (
              <span className="mono-label rounded-full border border-line-strong px-2 py-0.5">Em pauta</span>
            )}
            {!draft && article.readingTime && <span className="mono-label">{article.readingTime}</span>}
          </div>
          <RevealLines
            as="h1"
            immediate
            className="mt-8 font-display text-[clamp(2.3rem,5.4vw,4.75rem)] leading-[1] font-medium tracking-[-0.04em]"
            lines={[article.title]}
          />
          <Fade immediate delay={0.3}>
            <p className="mt-8 text-xl leading-relaxed text-graphite">{article.excerpt}</p>
          </Fade>

          {article.cover && (
            <img
              src={article.cover.src}
              alt={article.cover.alt}
              width={article.cover.width}
              height={article.cover.height}
              className="mt-14 w-full ring-1 ring-line"
            />
          )}

          {draft ? (
            <Fade immediate delay={0.4} className="mt-16 border border-line bg-navy/50 p-8 md:p-10">
              <p className="mono-label text-cyan">Artigo em produção</p>
              <p className="mt-4 leading-relaxed text-graphite">
                Este texto ainda está sendo escrito. Estes são os pontos que ele vai abordar:
              </p>
              {article.outline && (
                <ol className="mt-6 space-y-3">
                  {article.outline.map((o, i) => (
                    <li key={o} className="flex gap-4 border-t border-line pt-3 text-offwhite/90">
                      <span className="font-mono text-xs text-cyan">0{i + 1}</span>
                      {o}
                    </li>
                  ))}
                </ol>
              )}
              <div className="mt-10">
                <ButtonLink href="/#contato" variant="ghost">
                  Quer conversar sobre o tema?
                </ButtonLink>
              </div>
            </Fade>
          ) : (
            <div className="mt-10">{article.body?.map((b, i) => <Block key={i} b={b} />)}</div>
          )}
        </div>

        {others.length > 0 && (
          <section aria-labelledby="mais-insights" className="mt-32">
            <h2 id="mais-insights" className="mono-label mb-6">
              Outros temas
            </h2>
            <div className="border-b border-line">
              {others.map((a, i) => (
                <ArticleRow key={a.slug} article={a} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}
