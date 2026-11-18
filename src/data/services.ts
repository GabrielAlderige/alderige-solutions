export type ServiceVisual = 'web' | 'automation' | 'ai' | 'consulting'

export interface Service {
  id: string
  index: string
  title: string
  /** Rótulo curto usado no rodapé, menus e formulário. */
  short: string
  tag: string
  description: string
  capabilities: string[]
  visual: ServiceVisual
}

export const services: Service[] = [
  {
    id: 'desenvolvimento-web',
    index: '01',
    title: 'Desenvolvimento Web',
    short: 'Desenvolvimento Web',
    tag: 'build / web',
    description:
      'Desenvolvimento de sites institucionais, landing pages, plataformas e sistemas web personalizados.',
    capabilities: [
      'Sites institucionais',
      'Landing pages',
      'Sistemas web',
      'Aplicações personalizadas',
      'APIs e integrações',
      'Plataformas digitais',
    ],
    visual: 'web',
  },
  {
    id: 'automacao-empresarial',
    index: '02',
    title: 'Automação Empresarial',
    short: 'Automação',
    tag: 'flow / ops',
    description:
      'Automatizamos processos e conectamos ferramentas para reduzir tarefas manuais e aumentar a eficiência operacional.',
    capabilities: [
      'Automação de processos',
      'Integração entre sistemas',
      'Fluxos comerciais',
      'Integração com CRMs',
      'Automações com n8n',
      'Notificações e fluxos inteligentes',
    ],
    visual: 'automation',
  },
  {
    id: 'inteligencia-artificial',
    index: '03',
    title: 'Inteligência Artificial',
    short: 'Inteligência Artificial',
    tag: 'model / context',
    description:
      'Aplicamos inteligência artificial para criar experiências, ferramentas e processos mais inteligentes.',
    capabilities: [
      'Assistentes inteligentes',
      'Integração com modelos de IA',
      'Atendimento automatizado',
      'Análise e processamento de dados',
      'Sistemas contextualizados',
      'Aplicações de IA sob medida',
    ],
    visual: 'ai',
  },
  {
    id: 'consultoria-digital',
    index: '04',
    title: 'Consultoria e Soluções Digitais',
    short: 'Consultoria',
    tag: 'map / plan',
    description:
      'Ajudamos empresas a identificar oportunidades tecnológicas e transformar necessidades em projetos viáveis.',
    capabilities: [
      'Diagnóstico digital',
      'Mapeamento de processos',
      'Planejamento tecnológico',
      'Arquitetura de soluções',
      'Integração de ferramentas',
      'Orientação para transformação digital',
    ],
    visual: 'consulting',
  },
]

/** Categorias do formulário de contato. */
export const solutionCategories = [
  'Desenvolvimento Web',
  'Automação',
  'Inteligência Artificial',
  'Consultoria',
  'Outro',
] as const

export type SolutionCategory = (typeof solutionCategories)[number]
