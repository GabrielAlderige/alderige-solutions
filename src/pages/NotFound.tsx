import { ButtonLink } from '@/components/ui/Button'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export default function NotFound() {
  useDocumentMeta({ title: 'Página não encontrada', noindex: true })
  return (
    <section className="flex min-h-[80svh] items-center pt-32 pb-24">
      <div className="shell">
        <p className="mono-label text-cyan">Erro 404</p>
        <h1 className="mt-6 font-display text-[clamp(3rem,10vw,10rem)] leading-[0.9] font-medium tracking-[-0.05em]">
          Rota <span className="text-outline">não</span>
          <br />
          encontrada<span className="text-cyan">.</span>
        </h1>
        <p className="mt-8 max-w-[30rem] text-lg text-graphite">O endereço pode ter mudado ou nunca ter existido.</p>
        <div className="mt-10">
          <ButtonLink href="/">Voltar ao início</ButtonLink>
        </div>
      </div>
    </section>
  )
}
