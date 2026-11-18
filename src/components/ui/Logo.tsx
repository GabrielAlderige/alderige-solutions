import { site } from '@/config/site'
import { cx } from '@/utils/links'

interface LogoProps {
  className?: string
  /** 'full' = ALDERIGE + SOLUTIONS · 'word' = só ALDERIGE */
  variant?: 'full' | 'word'
}

/**
 * Logotipo provisório (tipográfico).
 * Quando o SVG oficial existir, defina `site.logo.src` em src/config/site.ts
 * e ele substitui esta composição automaticamente.
 */
export function Logo({ className, variant = 'full' }: LogoProps) {
  if (site.logo.src) {
    return <img src={site.logo.src} alt={site.name} className={cx('h-7 w-auto', className)} />
  }

  return (
    <span className={cx('inline-flex flex-col leading-none select-none', className)} aria-label={site.name} role="img">
      <span
        aria-hidden="true"
        className="font-display text-[1.15rem] font-semibold tracking-[0.16em] text-offwhite"
      >
        ALDERIGE
      </span>
      {variant === 'full' && (
        <span aria-hidden="true" className="mt-[5px] font-mono text-[0.5rem] tracking-[0.62em] text-graphite">
          SOLUTIONS
        </span>
      )}
    </span>
  )
}
