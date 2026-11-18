import { useEffect, useRef } from 'react'

/** Adiciona `.is-offscreen` quando o elemento sai da viewport, pausando animações CSS internas. */
export function useOffscreenPause<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => el.classList.toggle('is-offscreen', !e.isIntersecting), {
      rootMargin: '120px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}
