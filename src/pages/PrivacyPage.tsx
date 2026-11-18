import { site } from '@/config/site'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

/**
 * Política de privacidade base (LGPD), descrevendo o que o site realmente faz.
 * Revise com assessoria jurídica e atualize se adicionar analytics, cookies ou novos formulários.
 */
export default function PrivacyPage() {
  useDocumentMeta({ title: 'Política de privacidade', path: '/privacidade' })
  const { companyName, document, privacyUpdatedAt } = site.legal
  const analyticsOn = site.analytics.provider !== 'none' && site.analytics.id

  const h2 = 'mt-14 font-display text-2xl font-medium tracking-tight md:text-3xl'
  const p = 'mt-4 leading-relaxed text-graphite'

  return (
    <article className="pt-32 pb-24 md:pt-40">
      <div className="shell">
        <div className="mx-auto max-w-[46rem]">
          <p className="mono-label text-cyan">Documento</p>
          <h1 className="mt-6 font-display text-[clamp(2.4rem,6vw,5rem)] leading-[0.98] font-medium tracking-[-0.04em]">
            Política de privacidade
          </h1>
          {privacyUpdatedAt && <p className="mono-label mt-6">Atualizada em {privacyUpdatedAt}</p>}

          <p className="mt-10 text-lg leading-relaxed text-offwhite/90">
            Esta política explica como a {companyName}
            {document ? ` (CNPJ ${document})` : ''} trata os dados pessoais coletados neste site, em conformidade com a
            Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
          </p>

          <h2 className={h2}>1. Dados que coletamos</h2>
          <p className={p}>
            Coletamos apenas os dados que você informa voluntariamente no formulário de contato: nome, empresa, e-mail,
            número de WhatsApp, tipo de solução desejada e a descrição do seu desafio.
          </p>

          <h2 className={h2}>2. Finalidade</h2>
          <p className={p}>
            Os dados são usados exclusivamente para responder ao seu contato, entender sua necessidade e, se houver
            interesse mútuo, elaborar uma proposta. Não vendemos nem compartilhamos seus dados para fins de publicidade.
          </p>

          <h2 className={h2}>3. Base legal</h2>
          <p className={p}>
            O tratamento se baseia no seu consentimento, registrado no envio do formulário, e em procedimentos
            preliminares relacionados a um possível contrato, a seu pedido.
          </p>

          <h2 className={h2}>4. Compartilhamento</h2>
          <p className={p}>
            Os dados podem ser processados por fornecedores que viabilizam o funcionamento do site e o recebimento das
            mensagens (hospedagem e serviço de formulários), apenas na medida necessária para essas funções.
          </p>

          <h2 className={h2}>5. Cookies e métricas</h2>
          <p className={p}>
            {analyticsOn
              ? 'Utilizamos uma ferramenta de métricas de audiência para entender, de forma agregada, como o site é usado.'
              : 'No momento, este site não utiliza cookies de rastreamento nem ferramentas de métricas de audiência.'}
          </p>

          <h2 className={h2}>6. Armazenamento e segurança</h2>
          <p className={p}>
            Mantemos os dados pelo tempo necessário para cumprir a finalidade descrita ou obrigações legais, adotando
            medidas técnicas e organizacionais razoáveis para protegê-los.
          </p>

          <h2 className={h2}>7. Seus direitos</h2>
          <p className={p}>
            Você pode solicitar a qualquer momento acesso, correção, portabilidade ou exclusão dos seus dados, bem como
            revogar o consentimento.
            {site.contact.email ? (
              <>
                {' '}Para isso, escreva para{' '}
                <a href={`mailto:${site.contact.email}`} className="text-offwhite underline underline-offset-4">
                  {site.contact.email}
                </a>
                .
              </>
            ) : (
              ' Para isso, utilize os canais de contato informados neste site.'
            )}
          </p>

          <h2 className={h2}>8. Alterações</h2>
          <p className={p}>
            Esta política pode ser atualizada para refletir mudanças no site ou na legislação. A versão vigente estará
            sempre disponível nesta página.
          </p>
        </div>
      </div>
    </article>
  )
}
