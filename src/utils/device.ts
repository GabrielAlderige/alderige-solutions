/** Detecção de suporte e capacidade para decidir qualidade do 3D. */

export function supportsWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    const ok = !!gl
    ;(gl as WebGLRenderingContext | null)?.getExtension('WEBGL_lose_context')?.loseContext()
    return ok
  } catch {
    return false
  }
}

export function isLowPowerDevice(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  if (nav.connection?.saveData) return true
  if (window.matchMedia('(max-width: 767px)').matches) return true
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) return true
  if (nav.deviceMemory && nav.deviceMemory <= 4) return true
  return false
}

export const isFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
