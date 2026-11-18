import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { solutionCategories } from '@/data/services'
import { cx, whatsappLink } from '@/utils/links'
import { track } from '@/utils/analytics'
import { submitContact, type ContactPayload } from './formService'

type Field = keyof ContactPayload | 'consent'
type Errors = Partial<Record<Field, string>>
type Status = 'idle' | 'loading' | 'sent' | 'mailto' | 'not-configured' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(d: ContactPayload, consent: boolean): Errors {
  const e: Errors = {}
  if (d.nome.trim().length < 2) e.nome = 'Informe seu nome.'
  if (!EMAIL_RE.test(d.email.trim())) e.email = 'Informe um e-mail válido.'
  const phone = d.whatsapp.replace(/\D/g, '')
  if (phone && (phone.length < 10 || phone.length > 13)) e.whatsapp = 'Número incompleto — inclua o DDD.'
  if (!d.solucao) e.solucao = 'Escolha o tipo de solução.'
  if (d.mensagem.trim().length < 20) e.mensagem = 'Conte um pouco mais sobre o desafio (mínimo de 20 caracteres).'
  if (!consent) e.consent = 'É preciso concordar para enviarmos uma resposta.'
  return e
}

function maskPhone(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

const empty: ContactPayload = { nome: '', empresa: '', email: '', whatsapp: '', solucao: '', mensagem: '' }

export function ContactForm() {
  const uid = useId()
  const [data, setData] = useState<ContactPayload>(empty)
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const honeypot = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  const set = (k: keyof ContactPayload, v: string) => {
    const next = { ...data, [k]: k === 'whatsapp' ? maskPhone(v) : v }
    setData(next)
    if (touched[k]) setErrors(validate(next, consent))
  }
  const blur = (k: Field) => {
    setTouched((t) => ({ ...t, [k]: true }))
    setErrors(validate(data, consent))
  }
  const err = (k: Field) => (touched[k] ? errors[k] : undefined)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (honeypot.current?.value) return // bot
    const v = validate(data, consent)
    setErrors(v)
    setTouched({ nome: true, email: true, whatsapp: true, solucao: true, mensagem: true, consent: true })
    if (Object.keys(v).length) {
      const first = Object.keys(v)[0]
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setStatus('loading')
    try {
      const res = await submitContact(data)
      setStatus(res.kind)
      if (res.kind === 'sent') {
        track('contact_form_submit', { solucao: data.solucao })
        setData(empty)
        setConsent(false)
        setTouched({})
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('[form]', error)
      setStatus('error')
    }
    requestAnimationFrame(() => statusRef.current?.focus())
  }

  const wa = whatsappLink(
    data.mensagem ? `Olá! Vim pelo site da Alderige.\n\n${data.mensagem}` : undefined,
  )

  if (status === 'sent') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="border border-line bg-navy/60 p-8 outline-none md:p-12">
        <span className="grid size-12 place-items-center rounded-full bg-electric">
          <Check className="size-5" aria-hidden="true" />
        </span>
        <h3 className="mt-8 font-display text-3xl font-medium tracking-tight md:text-4xl">Mensagem recebida.</h3>
        <p className="mt-4 max-w-[30rem] leading-relaxed text-graphite">
          Obrigado pelo contato. Vamos ler com atenção e responder pelo e-mail informado.
        </p>
        <button type="button" onClick={() => setStatus('idle')} className="mt-8 text-sm text-offwhite underline underline-offset-4 hover:text-cyan">
          Enviar outra mensagem
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby={`${uid}-required`} className="relative">
      <p id={`${uid}-required`} className="mono-label mb-8">
        Campos com <span className="text-cyan">*</span> são obrigatórios
      </p>

      {/* Honeypot anti-spam */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Não preencha
          <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-x-8 gap-y-2 md:grid-cols-2">
        <TextField id={`${uid}-nome`} name="nome" label="Nome" required autoComplete="name" value={data.nome} onChange={(v) => set('nome', v)} onBlur={() => blur('nome')} error={err('nome')} />
        <TextField id={`${uid}-empresa`} name="empresa" label="Empresa" autoComplete="organization" value={data.empresa} onChange={(v) => set('empresa', v)} />
        <TextField id={`${uid}-email`} name="email" type="email" label="E-mail" required autoComplete="email" inputMode="email" value={data.email} onChange={(v) => set('email', v)} onBlur={() => blur('email')} error={err('email')} />
        <TextField id={`${uid}-whatsapp`} name="whatsapp" type="tel" label="WhatsApp" autoComplete="tel-national" inputMode="tel" placeholder="(00) 00000-0000" value={data.whatsapp} onChange={(v) => set('whatsapp', v)} onBlur={() => blur('whatsapp')} error={err('whatsapp')} />
      </div>

      <fieldset className="mt-8" aria-describedby={err('solucao') ? `${uid}-solucao-err` : undefined}>
        <legend className="mb-4 text-sm text-graphite">
          Tipo de solução desejada <span className="text-cyan">*</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {solutionCategories.map((c) => {
            const checked = data.solucao === c
            return (
              <label
                key={c}
                className={cx(
                  'relative cursor-pointer rounded-full border px-4 py-2.5 text-sm transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cyan',
                  checked ? 'border-electric bg-electric text-offwhite' : 'border-line-strong text-graphite hover:border-graphite hover:text-offwhite',
                )}
              >
                <input
                  type="radio"
                  name="solucao"
                  value={c}
                  checked={checked}
                  onChange={() => {
                    set('solucao', c)
                    setTouched((t) => ({ ...t, solucao: true }))
                    setErrors(validate({ ...data, solucao: c }, consent))
                  }}
                  className="sr-only"
                />
                {c}
              </label>
            )
          })}
        </div>
        <FieldError id={`${uid}-solucao-err`} msg={err('solucao')} />
      </fieldset>

      <div className="mt-6">
        <label htmlFor={`${uid}-mensagem`} className="block text-sm text-graphite">
          Descrição do desafio <span className="text-cyan">*</span>
        </label>
        <textarea
          id={`${uid}-mensagem`}
          name="mensagem"
          rows={5}
          value={data.mensagem}
          onChange={(e) => set('mensagem', e.target.value)}
          onBlur={() => blur('mensagem')}
          aria-invalid={!!err('mensagem')}
          aria-describedby={err('mensagem') ? `${uid}-mensagem-err` : undefined}
          placeholder="O que hoje poderia funcionar melhor? Processos, ferramentas, ideias…"
          className={cx(
            'mt-3 w-full resize-y border-b bg-transparent py-3 text-[1.0625rem] text-offwhite placeholder:text-graphite/50 focus:outline-none',
            err('mensagem') ? 'border-red-400' : 'border-line-strong focus:border-cyan',
          )}
        />
        <FieldError id={`${uid}-mensagem-err`} msg={err('mensagem')} />
      </div>

      <div className="mt-6">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-graphite">
          <input
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked)
              setTouched((t) => ({ ...t, consent: true }))
              setErrors(validate(data, e.target.checked))
            }}
            aria-invalid={!!err('consent')}
            aria-describedby={err('consent') ? `${uid}-consent-err` : undefined}
            className="mt-1 size-4 shrink-0 accent-electric"
          />
          <span>
            Concordo com o uso destes dados para que a Alderige responda ao meu contato, conforme a{' '}
            <Link to="/privacidade" className="text-offwhite underline underline-offset-4 hover:text-cyan">
              Política de Privacidade
            </Link>
            . <span className="text-cyan">*</span>
          </span>
        </label>
        <FieldError id={`${uid}-consent-err`} msg={err('consent')} />
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" disabled={status === 'loading'} icon={status !== 'loading'}>
          {status === 'loading' ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Enviando…
            </span>
          ) : (
            'Enviar mensagem'
          )}
        </Button>
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="text-sm text-graphite underline-offset-4 hover:text-offwhite hover:underline">
            ou fale direto pelo WhatsApp
          </a>
        )}
      </div>

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {status === 'mailto' && (
          <Notice tone="info">
            Abrimos seu aplicativo de e-mail com a mensagem pronta. Se nada aconteceu, verifique se há um app de e-mail
            configurado no seu dispositivo.
          </Notice>
        )}
        {status === 'not-configured' && (
          <Notice tone="warn">
            O envio por formulário ainda não está ativo neste site.{' '}
            {wa ? (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="text-offwhite underline underline-offset-4">
                Fale com a gente pelo WhatsApp.
              </a>
            ) : (
              'Os canais de contato serão publicados em breve.'
            )}
          </Notice>
        )}
        {status === 'error' && (
          <Notice tone="warn">
            Não conseguimos enviar agora. Verifique sua conexão e tente novamente
            {wa ? (
              <>
                {' '}ou{' '}
                <a href={wa} target="_blank" rel="noopener noreferrer" className="text-offwhite underline underline-offset-4">
                  fale pelo WhatsApp
                </a>
              </>
            ) : null}
            .
          </Notice>
        )}
      </div>
    </form>
  )
}

function Notice({ tone, children }: { tone: 'info' | 'warn'; children: ReactNode }) {
  return (
    <p
      role={tone === 'warn' ? 'alert' : 'status'}
      className={cx(
        'mt-6 flex items-start gap-3 border-l-2 py-1 pl-4 text-sm leading-relaxed',
        tone === 'warn' ? 'border-amber-300 text-amber-100/90' : 'border-cyan text-graphite',
      )}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null
  return (
    <p id={id} className="mt-2 text-[0.8125rem] text-red-300">
      {msg}
    </p>
  )
}

interface TextFieldProps {
  id: string
  name: string
  label: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  error?: string
  required?: boolean
  type?: string
  autoComplete?: string
  inputMode?: 'email' | 'tel' | 'text'
  placeholder?: string
}

function TextField({ id, name, label, value, onChange, onBlur, error, required, type = 'text', autoComplete, inputMode, placeholder }: TextFieldProps) {
  return (
    <div className="py-3">
      <label htmlFor={id} className="block text-sm text-graphite">
        {label} {required && <span className="text-cyan">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cx(
          'mt-2 w-full border-b bg-transparent py-3 text-[1.0625rem] text-offwhite transition-colors placeholder:text-graphite/45 focus:outline-none',
          error ? 'border-red-400' : 'border-line-strong focus:border-cyan',
        )}
      />
      <FieldError id={`${id}-err`} msg={error} />
    </div>
  )
}
