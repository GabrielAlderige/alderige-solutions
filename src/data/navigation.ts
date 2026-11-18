export interface NavItem {
  label: string
  /** Âncora da home (sem #). */
  id: string
}

export const navItems: NavItem[] = [
  { label: 'Início', id: 'inicio' },
  { label: 'Sobre', id: 'sobre' },
  { label: 'Soluções', id: 'solucoes' },
  { label: 'Projetos', id: 'projetos' },
  { label: 'Insights', id: 'insights' },
  { label: 'Contato', id: 'contato' },
]

export const supportPhrases = [
  'Ideias conectadas. Soluções inteligentes.',
  'Construindo o próximo nível dos negócios.',
  'Menos processos manuais. Mais possibilidades.',
  'Tecnologia pensada para resolver.',
  'Transformamos complexidade em soluções.',
]
