/**
 * Projetos exibidos em /#projetos e /projetos/:slug.
 *
 * Para adicionar um projeto real: copie um objeto, ajuste os campos e
 * use `kind: 'cliente'` ou `kind: 'proprio'`. Imagens vão em /public/projects/<slug>/.
 *
 * Regra da marca: não inventar clientes, depoimentos ou resultados.
 * Conceitos e experimentos internos devem usar `kind: 'conceito'` —
 * o site sinaliza isso de forma explícita.
 */

export type ProjectKind = 'cliente' | 'proprio' | 'conceito'
export type ProjectVisual = 'interface' | 'flow' | 'signal'

export interface ProjectResult {
  label: string
  value: string
}

export interface ProjectImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface Project {
  slug: string
  index: string
  name: string
  category: string
  kind: ProjectKind
  /** Ano de entrega, quando houver. Não preencher em conceitos. */
  year?: string
  summary: string
  problem: string
  solution: string
  technologies: string[]
  /** Somente resultados medidos. Deixe vazio se não houver. */
  results: ProjectResult[]
  images: ProjectImage[]
  /** Link para demonstração pública, quando existir. */
  demoUrl?: string
  /** Visual gerado usado enquanto não houver imagens. */
  visual: ProjectVisual
}

export const projectKindLabel: Record<ProjectKind, string> = {
  cliente: 'Projeto de cliente',
  proprio: 'Projeto próprio',
  conceito: 'Conceito interno',
}

export const projects: Project[] = [
  {
    slug: 'site-institucional-alderige',
    index: '01',
    name: 'Presença digital Alderige',
    category: 'Desenvolvimento Web',
    kind: 'proprio',
    summary:
      'O website da própria Alderige: identidade experimental, 3D em tempo real e uma estrutura de conteúdo pronta para crescer.',
    problem:
      'A empresa precisava de uma presença digital que demonstrasse, na prática, o cuidado técnico e a identidade visual que entrega aos clientes — sem depender de templates.',
    solution:
      'Um site em React e TypeScript com escultura 3D procedural em WebGL, animações guiadas pelo scroll, conteúdo centralizado em arquivos de dados e fallback leve para dispositivos sem suporte a 3D.',
    technologies: ['React', 'TypeScript', 'Vite', 'Three.js', 'GSAP', 'Tailwind CSS'],
    results: [],
    images: [],
    visual: 'interface',
  },
  {
    slug: 'triagem-de-atendimento-com-ia',
    index: '02',
    name: 'Triagem de atendimento com IA',
    category: 'Inteligência Artificial',
    kind: 'conceito',
    summary:
      'Estudo de um assistente que organiza a entrada de mensagens de uma clínica antes de chegar à recepção.',
    problem:
      'Em clínicas e empresas de serviços, boa parte das mensagens recebidas repete as mesmas dúvidas — horários, convênios, preparo — e disputa atenção com pedidos que precisam de uma pessoa.',
    solution:
      'Um fluxo que identifica a intenção da mensagem, responde dúvidas frequentes a partir de conteúdo aprovado pela própria empresa e encaminha para a equipe tudo o que exige decisão humana, com o contexto já resumido.',
    technologies: ['n8n', 'API de modelo de linguagem', 'WhatsApp Business Platform', 'Base de conhecimento'],
    results: [],
    images: [],
    visual: 'signal',
  },
  {
    slug: 'pipeline-de-propostas-comerciais',
    index: '03',
    name: 'Pipeline de propostas comerciais',
    category: 'Automação Empresarial',
    kind: 'conceito',
    summary:
      'Experimento de automação que conecta CRM, geração de documentos e notificações em um único fluxo.',
    problem:
      'Montar propostas manualmente — copiar dados do CRM, preencher modelo, revisar, enviar e lembrar do follow-up — consome tempo e abre espaço para erros.',
    solution:
      'Quando uma oportunidade muda de etapa no CRM, o fluxo gera a proposta a partir de um modelo, envia para revisão interna, registra o envio e agenda lembretes de acompanhamento.',
    technologies: ['n8n', 'CRM via API', 'Google Docs API', 'E-mail transacional'],
    results: [],
    images: [],
    visual: 'flow',
  },
]

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
