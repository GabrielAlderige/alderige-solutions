import { site } from '@/config/site'

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ')

/** Link wa.me a partir do número configurado. Retorna null se não houver número. */
export function whatsappLink(message = site.contact.whatsappMessage): string | null {
  const digits = site.contact.whatsapp.replace(/\D/g, '')
  if (!digits) return null
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export const emailLink = (subject?: string) =>
  site.contact.email
    ? `mailto:${site.contact.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`
    : null

export const socialLinks = () =>
  (
    [
      { label: 'Instagram', href: site.social.instagram },
      { label: 'LinkedIn', href: site.social.linkedin },
    ] as const
  ).filter((s) => s.href)
