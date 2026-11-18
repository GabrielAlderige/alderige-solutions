/**
 * Artigos da área Insights (/#insights e /insights/:slug).
 *
 * `status: 'em-pauta'` = tema planejado, ainda sem texto publicado.
 * O site identifica esses itens como "Em pauta" e não exibe data.
 *
 * Para publicar: mude para `status: 'publicado'`, preencha `date` (AAAA-MM-DD),
 * `cover` (opcional, em /public/insights/) e `body`.
 */

export type ArticleStatus = 'publicado' | 'em-pauta'

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] }

export interface Article {
  slug: string
  title: string
  category: ArticleCategory
  status: ArticleStatus
  /** Data de publicação real (AAAA-MM-DD). Somente para artigos publicados. */
  date?: string
  excerpt: string
  readingTime?: string
  cover?: { src: string; alt: string; width: number; height: number }
  /** Tópicos planejados (usados em artigos em pauta). */
  outline?: string[]
  body?: ArticleBlock[]
}

export const articleCategories = [
  'Inteligência Artificial',
  'Automação Empresarial',
  'Desenvolvimento de Software',
  'Transformação Digital',
  'Tecnologia e Negócios',
] as const

export type ArticleCategory = (typeof articleCategories)[number]

export const articles: Article[] = [
  {
    slug: 'ia-aplicada-por-onde-comecar',
    title: 'IA aplicada sem promessas mágicas: por onde começar',
    category: 'Inteligência Artificial',
    status: 'em-pauta',
    excerpt:
      'Como separar casos de uso viáveis de expectativas irreais e escolher o primeiro projeto de IA de uma empresa.',
    outline: [
      'Problemas que a IA resolve bem — e os que ela não resolve',
      'Dados, contexto e supervisão humana',
      'Como medir se valeu a pena',
    ],
  },
  {
    slug: 'quando-automatizar-um-processo',
    title: 'Quando automatizar um processo (e quando não)',
    category: 'Automação Empresarial',
    status: 'em-pauta',
    excerpt:
      'Frequência, padronização e custo do erro: critérios práticos para decidir o que vale automatizar primeiro.',
    outline: [
      'Sinais de que um processo está pronto para automação',
      'Automatizar um processo ruim só acelera o problema',
      'Ferramentas: n8n, integrações nativas e código próprio',
    ],
  },
  {
    slug: 'sistema-sob-medida-ou-ferramenta-pronta',
    title: 'Sistema sob medida ou ferramenta pronta?',
    category: 'Desenvolvimento de Software',
    status: 'em-pauta',
    excerpt:
      'Uma forma honesta de comparar custo, flexibilidade e manutenção antes de decidir construir.',
    outline: [
      'O custo real de adaptar a empresa à ferramenta',
      'Quando o sob medida se paga',
      'Caminhos híbridos: integrar em vez de substituir',
    ],
  },
  {
    slug: 'transformacao-digital-comeca-pelo-mapa',
    title: 'Transformação digital começa pelo mapa de processos',
    category: 'Transformação Digital',
    status: 'em-pauta',
    excerpt:
      'Antes de escolher tecnologia, entender como o trabalho realmente acontece dentro da empresa.',
    outline: [
      'Mapear o processo como ele é, não como deveria ser',
      'Onde estão os gargalos e retrabalhos',
      'Do mapa ao plano tecnológico',
    ],
  },
]

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug)

export const formatArticleDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
