import { site } from '@/config/site'

export interface ContactPayload {
  nome: string
  empresa: string
  email: string
  whatsapp: string
  solucao: string
  mensagem: string
}

export type SubmitResult =
  | { kind: 'sent' }
  | { kind: 'mailto' }
  | { kind: 'not-configured' }

/**
 * Envia o formulário.
 * 1. `site.form.endpoint` definido → POST JSON (Formspree, Getform, n8n webhook, API própria…)
 * 2. Sem endpoint, mas com e-mail → abre o cliente de e-mail do usuário com a mensagem pronta
 * 3. Nenhum dos dois → informa que o envio não está configurado (nada é simulado)
 */
export async function submitContact(data: ContactPayload): Promise<SubmitResult> {
  if (site.form.endpoint) {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 15000)
    try {
      const res = await fetch(site.form.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, origem: 'site', pagina: window.location.href }),
        signal: controller.signal,
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return { kind: 'sent' }
    } finally {
      window.clearTimeout(timer)
    }
  }

  if (site.contact.email) {
    const body = [
      `Nome: ${data.nome}`,
      data.empresa ? `Empresa: ${data.empresa}` : null,
      `E-mail: ${data.email}`,
      data.whatsapp ? `WhatsApp: ${data.whatsapp}` : null,
      `Solução: ${data.solucao}`,
      '',
      data.mensagem,
    ]
      .filter((l): l is string => l !== null)
      .join('\n')
    const subject = `Contato pelo site — ${data.solucao}`
    window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    return { kind: 'mailto' }
  }

  return { kind: 'not-configured' }
}
