import { supportPhrases } from '@/data/navigation'

/** Faixa contínua com as frases de apoio da marca. Pausa com prefers-reduced-motion. */
export function Marquee() {
  const items = [...supportPhrases, ...supportPhrases]
  return (
    <div className="relative overflow-hidden border-y border-line py-5" aria-label="Frases da marca">
      <div className="marquee-track" aria-hidden="true">
        {items.map((p, i) => (
          <span key={i} className="flex items-center whitespace-nowrap font-display text-[clamp(1.25rem,2.6vw,2.25rem)] font-light tracking-tight">
            <span className={i % 2 ? 'text-outline' : 'text-offwhite'}>{p}</span>
            <span className="mx-8 inline-block size-1.5 rotate-45 bg-electric" />
          </span>
        ))}
      </div>
      <ul className="sr-only">
        {supportPhrases.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  )
}
