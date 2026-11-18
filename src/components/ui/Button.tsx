import { ArrowUpRight } from 'lucide-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '@/utils/links'

type Variant = 'primary' | 'ghost' | 'line'

const base =
  'group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-display text-[0.95rem] font-medium tracking-tight transition-[color,background-color,border-color,transform] duration-500 ease-[var(--ease-expo)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'h-13 px-7 bg-offwhite text-midnight hover:text-offwhite',
  ghost: 'h-13 px-7 border border-line-strong text-offwhite hover:border-cyan/70',
  line: 'h-auto px-0 rounded-none text-offwhite',
}

function Inner({ children, variant, icon = true }: { children: ReactNode; variant: Variant; icon?: boolean }) {
  return (
    <>
      {variant === 'primary' && (
        <span
          aria-hidden="true"
          className="absolute inset-0 translate-y-full rounded-full bg-electric transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0"
        />
      )}
      <span className={cx('relative', variant === 'line' && 'bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]')}>
        {children}
      </span>
      {icon && (
        <span
          aria-hidden="true"
          className={cx(
            'relative grid size-6 place-items-center overflow-hidden rounded-full',
            variant === 'primary' ? 'bg-midnight text-offwhite' : 'border border-line-strong',
          )}
        >
          <ArrowUpRight className="size-3.5 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-4 group-hover:-translate-y-4" />
          <ArrowUpRight className="absolute size-3.5 -translate-x-4 translate-y-4 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-0 group-hover:translate-y-0" />
        </span>
      )}
    </>
  )
}

interface CommonProps {
  variant?: Variant
  icon?: boolean
  className?: string
  children: ReactNode
}

export function ButtonLink({
  href,
  variant = 'primary',
  icon,
  className,
  children,
  ...rest
}: CommonProps & { href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'className' | 'children'>) {
  const cls = cx(base, variants[variant], className)
  const internal = href.startsWith('/') && !href.startsWith('//')
  if (internal) {
    return (
      <Link to={href} className={cls} {...rest}>
        <Inner variant={variant} icon={icon}>{children}</Inner>
      </Link>
    )
  }
  return (
    <a href={href} className={cls} {...rest}>
      <Inner variant={variant} icon={icon}>{children}</Inner>
    </a>
  )
}

export function Button({
  variant = 'primary',
  icon,
  className,
  children,
  ...rest
}: CommonProps & Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'>) {
  return (
    <button className={cx(base, variants[variant], className)} {...rest}>
      <Inner variant={variant} icon={icon}>{children}</Inner>
    </button>
  )
}
