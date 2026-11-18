/**
 * Configuração central da Alderige Solutions.
 *
 * Todos os dados de contato, redes e integrações ficam aqui.
 * Campos vazios ('') NÃO são exibidos no site — nada é inventado.
 * Preencha quando os dados oficiais estiverem disponíveis.
 */

export type AnalyticsProvider = 'none' | 'plausible' | 'ga4'

export interface SiteConfig {
  name: string
  shortName: string
  tagline: string
  description: string
  /** URL pública definitiva, sem barra no final. Necessária para canonical, sitemap e Open Graph absolutos. */
  url: string
  locale: string
  logo: {
    /** Caminho do SVG oficial (ex.: '/brand/alderige-logo.svg'). Vazio = usa o logotipo tipográfico provisório. */
    src: string
    /** Versão símbolo isolado, quando existir. */
    symbolSrc: string
  }
  contact: {
    email: string
    /** Somente dígitos, com DDI e DDD. Ex.: '5511999999999' */
    whatsapp: string
    whatsappMessage: string
  }
  social: {
    instagram: string
    linkedin: string
  }
  form: {
    /**
     * Endpoint que recebe POST JSON com os campos do formulário.
     * Compatível com Formspree, Getform, Basin, n8n Webhook, ou API própria.
     * Vazio = o formulário não envia (e avisa o usuário) — não há simulação.
     */
    endpoint: string
  }
  analytics: {
    provider: AnalyticsProvider
    /** Domínio (Plausible) ou Measurement ID (GA4). */
    id: string
  }
  legal: {
    companyName: string
    /** CNPJ, quando houver. */
    document: string
    privacyUpdatedAt: string
  }
}

export const site: SiteConfig = {
  name: 'Alderige Solutions',
  shortName: 'Alderige',
  tagline: 'Tecnologia que transforma negócios.',
  description:
    'A Alderige Solutions desenvolve soluções digitais, sistemas web, automações empresariais e aplicações de inteligência artificial para empresas que querem operar melhor.',
  url: 'https://gabrielalderige.github.io/alderige-solutions',
  locale: 'pt_BR',
  logo: {
    src: '',
    symbolSrc: '',
  },
  contact: {
    email: '',
    whatsapp: '',
    whatsappMessage: 'Olá! Vim pelo site da Alderige e gostaria de conversar sobre um projeto.',
  },
  social: {
    instagram: '',
    linkedin: '',
  },
  form: {
    endpoint: '',
  },
  analytics: {
    provider: 'none',
    id: '',
  },
  legal: {
    companyName: 'Alderige Solutions',
    document: '',
    privacyUpdatedAt: '',
  },
}
