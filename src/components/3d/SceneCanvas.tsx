import { useEffect, useRef, useState } from 'react'
import { SceneFallback } from './SceneFallback'
import { pointer, sceneStore } from './sceneStore'
import { isFinePointer, isLowPowerDevice, supportsWebGL } from '@/utils/device'
import { prefersReducedMotion } from '@/hooks/useReducedMotion'

type Status = 'loading' | 'ready' | 'fallback'

/**
 * Camada 3D fixa atrÃ¡s do conteÃºdo da home.
 * - Carregamento progressivo: o fallback SVG aparece imediatamente;
 *   three.js Ã© importado sob demanda depois do primeiro paint.
 * - Sem WebGL â†’ fallback permanente.
 * - prefers-reduced-motion â†’ quadros estÃ¡ticos, sem loop contÃ­nuo.
 */
export function SceneCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (!supportsWebGL()) {
      setStatus('fallback')
      return
    }

    let disposed = false
    let cleanup = () => {}

    const boot = async () => {
      try {
        const { Sculpture } = await import('./sculpture')
        if (disposed) return
        const reduced = prefersReducedMotion()
        const sculpture = new Sculpture({
          canvas,
          quality: isLowPowerDevice() ? 'low' : 'high',
          animate: !reduced,
          initial: sceneStore.get(),
        })
        sculpture.setTarget(sceneStore.get())
        if (!reduced) sculpture.start()
        setStatus('ready')

        const unsub = sceneStore.subscribe((t) => sculpture.setTarget(t))

        const onResize = () => sculpture.resize()
        window.addEventListener('resize', onResize)

        const fine = isFinePointer()
        const onMove = (e: PointerEvent) => {
          pointer.x = (e.clientX / window.innerWidth) * 2 - 1
          pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
          sculpture.setPointer(pointer.x, pointer.y)
        }
        if (fine && !reduced) window.addEventListener('pointermove', onMove, { passive: true })

        const onVisibility = () => {
          if (document.hidden) sculpture.stop()
          else if (!reduced) sculpture.start()
        }
        document.addEventListener('visibilitychange', onVisibility)

        const onLost = (e: Event) => {
          e.preventDefault()
          sculpture.stop()
          setStatus('fallback')
        }
        canvas.addEventListener('webglcontextlost', onLost)

        cleanup = () => {
          unsub()
          window.removeEventListener('resize', onResize)
          window.removeEventListener('pointermove', onMove)
          document.removeEventListener('visibilitychange', onVisibility)
          canvas.removeEventListener('webglcontextlost', onLost)
          sculpture.dispose()
        }
      } catch (err) {
        if (import.meta.env.DEV) console.warn('[3D] fallback ativado:', err)
        if (!disposed) setStatus('fallback')
      }
    }

    // Carrega o 3D depois que a pÃ¡gina ficou interativa
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
    const schedule = w.requestIdleCallback
      ? () => w.requestIdleCallback!(() => void boot(), { timeout: 900 })
      : () => window.setTimeout(() => void boot(), 250)
    schedule()

    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  // A opacidade da camada (brilho + fallback) acompanha a coreografia do scroll
  useEffect(() => {
    const apply = () => {
      if (wrapRef.current) wrapRef.current.style.opacity = String(sceneStore.get().opacity)
    }
    apply()
    return sceneStore.subscribe(apply)
  }, [])

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500">
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_45%,rgba(0,102,255,0.13),transparent_70%)]" />
      <SceneFallback visible={status !== 'ready'} />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ opacity: 0 }}
      />
    </div>
  )
}
