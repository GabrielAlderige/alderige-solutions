import { useLayoutEffect, useRef, type ElementType, type ReactNode } from 'react'
import { gsap } from '@/utils/gsap'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'
import { cx } from '@/utils/links'

interface RevealLinesProps {
  as?: ElementType
  lines: ReactNode[]
  className?: string
  lineClassName?: (i: number) => string | undefined
  /** Anima imediatamente (hero) em vez de esperar o scroll. */
  immediate?: boolean
  delay?: number
  id?: string
}

/** Título com entrada por máscara, linha a linha. */
export function RevealLines({ as: Tag = 'h2', lines, className, lineClassName, immediate, delay = 0, id }: RevealLinesProps) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const inners = el.querySelectorAll<HTMLElement>('.reveal-line > span')
      gsap.from(inners, {
        yPercent: 112,
        rotate: 2.5,
        duration: 1.25,
        stagger: 0.085,
        delay,
        ease: 'expo.out',
        scrollTrigger: immediate ? undefined : { trigger: el, start: 'top 86%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [immediate, delay])

  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className={cx('reveal-line', lineClassName?.(i))}>
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  )
}

interface FadeProps {
  as?: ElementType
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  immediate?: boolean
  stagger?: boolean
}

/** Entrada suave (opacidade + deslocamento). Com `stagger`, anima os filhos diretos em sequência. */
export function Fade({ as: Tag = 'div', children, className, delay = 0, y = 28, immediate, stagger }: FadeProps) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const targets = stagger ? Array.from(el.children) : el
      gsap.from(targets, {
        autoAlpha: 0,
        y,
        duration: 1.2,
        delay,
        stagger: stagger ? 0.08 : 0,
        scrollTrigger: immediate ? undefined : { trigger: el, start: 'top 88%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [delay, y, immediate, stagger])

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}

/** Parágrafo em que as palavras "acendem" conforme o scroll avança. */
export function ScrubWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-word]'),
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 52%', scrub: 0.6 },
        },
      )
    }, el)
    return () => ctx.revert()
  }, [text])

  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} data-word="">
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  )
}
