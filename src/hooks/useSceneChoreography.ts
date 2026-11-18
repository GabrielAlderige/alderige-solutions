import { useEffect } from 'react'
import { sceneStore, type SceneTarget } from '@/components/3d/sceneStore'

type Key = { at: number; s: SceneTarget }

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const ease = (t: number) => t * t * (3 - 2 * t)

/**
 * Coreografia da escultura ao longo da home:
 * hero (protagonista à direita) → manifesto (recua à esquerda, translúcida)
 * → some durante soluções/projetos/processo (cada seção tem seus próprios visuais; GPU livre)
 * → retorna ao centro no CTA final → sai antes do formulário.
 */
export function useSceneChoreography() {
  useEffect(() => {
    let raf = 0

    const compute = () => {
      raf = 0
      const vh = window.innerHeight
      const mobile = window.innerWidth < 768
      const y = window.scrollY
      const top = (id: string) => {
        const el = document.getElementById(id)
        return el ? el.getBoundingClientRect().top + y : Infinity
      }

      const hero: SceneTarget = mobile
        ? { x: 0, y: 1.25, scale: 0.8, spin: 0, opacity: 1, glow: 1 }
        : { x: 1.6, y: 0.22, scale: 0.94, spin: 0, opacity: 1, glow: 1 }
      const manifesto: SceneTarget = mobile
        ? { x: 1.1, y: 0.6, scale: 0.55, spin: 1.3, opacity: 0.28, glow: 0.4 }
        : { x: 2.55, y: 0.35, scale: 0.6, spin: 1.3, opacity: 0.55, glow: 0.6 }
      const away = (spin: number, x = manifesto.x): SceneTarget => ({ ...manifesto, x, spin, opacity: 0, scale: 0.5 })
      const cta: SceneTarget = mobile
        ? { x: 0, y: 0.3, scale: 0.85, spin: 4.4, opacity: 0.6, glow: 0.8 }
        : { x: 0, y: 0.25, scale: 1.05, spin: 4.4, opacity: 0.72, glow: 0.8 }

      const sobre = top('sobre')
      const solucoes = top('solucoes')
      const ctaTop = top('cta-final')
      const contato = top('contato')

      const keys: Key[] = [
        { at: 0, s: hero },
        { at: sobre - vh * 0.15, s: manifesto },
        { at: solucoes - vh * 0.7, s: { ...manifesto, spin: 2 } },
        { at: solucoes - vh * 0.15, s: away(2.4) },
        { at: ctaTop - vh * 0.9, s: away(3.2, 0) },
        { at: ctaTop, s: cta },
        { at: contato - vh * 0.65, s: { ...cta, spin: 5 } },
        { at: contato - vh * 0.15, s: { ...cta, spin: 5.3, opacity: 0, scale: 0.9 } },
      ].filter((k) => Number.isFinite(k.at))

      let result = keys[keys.length - 1].s
      if (y <= keys[0].at) result = keys[0].s
      else {
        for (let i = 0; i < keys.length - 1; i++) {
          const a = keys[i]
          const b = keys[i + 1]
          if (y >= a.at && y <= b.at) {
            const t = ease(b.at === a.at ? 1 : (y - a.at) / (b.at - a.at))
            result = {
              x: lerp(a.s.x, b.s.x, t),
              y: lerp(a.s.y, b.s.y, t),
              scale: lerp(a.s.scale, b.s.scale, t),
              spin: lerp(a.s.spin, b.s.spin, t),
              opacity: lerp(a.s.opacity, b.s.opacity, t),
              glow: lerp(a.s.glow, b.s.glow, t),
            }
            break
          }
        }
      }
      sceneStore.set(result)
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute)
    }
    compute()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const ro = new ResizeObserver(schedule)
    ro.observe(document.body)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      ro.disconnect()
    }
  }, [])
}
